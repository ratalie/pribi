import { defineStore } from 'pinia';
import {
  ListDocumentosSocietariosUseCase,
  GetDocumentoSocietarioUseCase,
  UploadDocumentoUseCase,
  DownloadDocumentoUseCase,
  DeleteDocumentoUseCase,
  CreateCarpetaSistemaUseCase,
  NavigateCarpetaUseCase,
} from '~/core/hexag/repositorio/almacenamiento/application';
import type { DocumentoSocietario } from '~/core/hexag/repositorio/almacenamiento/domain/entities/documento-societario.entity';
// import type { CarpetaSistema } from '~/core/hexag/repositorio/almacenamiento/domain/entities/carpeta-sistema.entity'; // No usado
import type { CreateCarpetaDTO, UploadDocumentoDTO } from '~/core/hexag/repositorio/almacenamiento/application/dtos/documento-societario.dto';
import { AlmacenamientoMockRepository } from '~/core/hexag/repositorio/almacenamiento/infrastructure';

type Status = 'idle' | 'loading' | 'uploading' | 'error';

/**
 * Store para Almacenamiento
 * Usa Option API según las reglas del proyecto
 */
export const useAlmacenamientoStore = defineStore('almacenamiento', {
  state: () => ({
    documentos: [] as DocumentoSocietario[],
    documentoActual: null as DocumentoSocietario | null,
    carpetaActual: null as string | null, // ID de la carpeta actual (null = raíz)
    breadcrumb: [] as Array<{ id: string; nombre: string }>,
    vista: 'grid' as 'grid' | 'list',
    status: 'idle' as Status,
    errorMessage: null as string | null,
    sociedadId: null as string | null,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    isUploading: (state) => state.status === 'uploading',
    hasError: (state) => state.status === 'error',
    carpetas: (state) => state.documentos.filter((d) => d.tipo === 'folder'),
    archivos: (state) => state.documentos.filter((d) => d.tipo === 'file'),
  },

  actions: {
    /**
     * Establece la sociedad actual
     */
    setSociedadId(sociedadId: string) {
      this.sociedadId = sociedadId;
    },

    /**
     * Establece la vista (grid o list)
     */
    setVista(vista: 'grid' | 'list') {
      this.vista = vista;
    },

    /**
     * Carga los documentos de la carpeta actual
     */
    async cargarDocumentos(parentId: string | null = null, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;
      this.carpetaActual = parentId;

      try {
        const repository = new AlmacenamientoMockRepository();
        const useCase = new ListDocumentosSocietariosUseCase(repository);
        const documentos = await useCase.execute(id, parentId);

        this.documentos = documentos;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[AlmacenamientoStore] Error al cargar documentos:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar los documentos';
      }
    },

    /**
     * Navega a una carpeta
     */
    async navegarACarpeta(carpetaId: string, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new AlmacenamientoMockRepository();
        const useCase = new NavigateCarpetaUseCase(repository);
        const documentos = await useCase.execute(id, carpetaId);

        // Actualizar breadcrumb
        const carpeta = this.documentos.find((d) => d.id === carpetaId);
        if (carpeta) {
          this.breadcrumb.push({ id: carpetaId, nombre: carpeta.nombre });
        }

        this.documentos = documentos;
        this.carpetaActual = carpetaId;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[AlmacenamientoStore] Error al navegar a carpeta:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos navegar a la carpeta';
      }
    },

    /**
     * Navega hacia atrás (a la carpeta padre)
     */
    async navegarAtras(sociedadId?: string) {
      if (this.breadcrumb.length === 0) {
        // Volver a raíz
        await this.cargarDocumentos(null, sociedadId);
        this.breadcrumb = [];
        this.carpetaActual = null;
        return;
      }

      // Remover último elemento del breadcrumb
      const nuevoBreadcrumb = [...this.breadcrumb];
      nuevoBreadcrumb.pop();
      this.breadcrumb = nuevoBreadcrumb;

      // Si hay breadcrumb, navegar a la carpeta padre
      if (nuevoBreadcrumb.length > 0) {
        const carpetaPadre = nuevoBreadcrumb[nuevoBreadcrumb.length - 1];
        if (carpetaPadre) {
          await this.navegarACarpeta(carpetaPadre.id, sociedadId);
        }
      } else {
        // Volver a raíz
        await this.cargarDocumentos(null, sociedadId);
        this.carpetaActual = null;
      }
    },

    /**
     * Obtiene un documento específico
     */
    async obtenerDocumento(documentoId: string, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return null;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new AlmacenamientoMockRepository();
        const useCase = new GetDocumentoSocietarioUseCase(repository);
        const documento = await useCase.execute(id, documentoId);

        this.documentoActual = documento;
        this.status = 'idle';
        return documento;
      } catch (error: any) {
        console.error('[AlmacenamientoStore] Error al obtener documento:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos obtener el documento';
        return null;
      }
    },

    /**
     * Crea una nueva carpeta
     */
    async crearCarpeta(dto: CreateCarpetaDTO, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return null;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new AlmacenamientoMockRepository();
        const useCase = new CreateCarpetaSistemaUseCase(repository);
        const carpeta = await useCase.execute(id, dto);

        // Recargar documentos
        await this.cargarDocumentos(dto.parentId, id);
        this.status = 'idle';
        return carpeta;
      } catch (error: any) {
        console.error('[AlmacenamientoStore] Error al crear carpeta:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos crear la carpeta';
        return null;
      }
    },

    /**
     * Sube un documento
     */
    async subirDocumento(dto: UploadDocumentoDTO, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return null;
      }

      this.status = 'uploading';
      this.errorMessage = null;

      try {
        const repository = new AlmacenamientoMockRepository();
        const useCase = new UploadDocumentoUseCase(repository);
        const documento = await useCase.execute(id, dto);

        // Recargar documentos
        await this.cargarDocumentos(dto.parentId, id);
        this.status = 'idle';
        return documento;
      } catch (error: any) {
        console.error('[AlmacenamientoStore] Error al subir documento:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos subir el documento';
        return null;
      }
    },

    /**
     * Descarga un documento
     */
    async descargarDocumento(documentoId: string, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new AlmacenamientoMockRepository();
        const useCase = new DownloadDocumentoUseCase(repository);
        const blob = await useCase.execute(id, documentoId);

        // Crear link de descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const documento = this.documentos.find((d) => d.id === documentoId);
        a.download = documento?.nombre || 'documento.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.status = 'idle';
      } catch (error: any) {
        console.error('[AlmacenamientoStore] Error al descargar documento:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos descargar el documento';
      }
    },

    /**
     * Elimina un documento o carpeta
     */
    async eliminarDocumento(documentoId: string, sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new AlmacenamientoMockRepository();
        const useCase = new DeleteDocumentoUseCase(repository);
        await useCase.execute(id, documentoId);

        // Recargar documentos
        await this.cargarDocumentos(this.carpetaActual, id);
        this.status = 'idle';
      } catch (error: any) {
        console.error('[AlmacenamientoStore] Error al eliminar documento:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos eliminar el documento';
      }
    },

    /**
     * Limpia el documento actual
     */
    limpiarDocumentoActual() {
      this.documentoActual = null;
    },
  },
});

