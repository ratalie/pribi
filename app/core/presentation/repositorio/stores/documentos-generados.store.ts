import { defineStore } from 'pinia';
import { ListDocumentosGeneradosUseCase } from '~/core/hexag/repositorio/documentos-generados/application/use-cases/list-documentos-generados.use-case';
import { GetDocumentoUseCase } from '~/core/hexag/repositorio/documentos-generados/application/use-cases/get-documento.use-case';
import type { DocumentosGenerados } from '~/core/hexag/repositorio/documentos-generados/domain/entities/categoria-documentos.entity';
import type { DocumentoGenerado } from '~/core/hexag/repositorio/documentos-generados/domain/entities/documento-generado.entity';
import { DocumentosGeneradosMockRepository } from '~/core/hexag/repositorio/documentos-generados/infrastructure';

type Status = 'idle' | 'loading' | 'error';

/**
 * Store para Documentos Generados
 * Usa Option API según las reglas del proyecto
 */
export const useDocumentosGeneradosStore = defineStore('documentos-generados', {
  state: () => ({
    documentosGenerados: null as DocumentosGenerados | null,
    documentoActual: null as DocumentoGenerado | null,
    status: 'idle' as Status,
    errorMessage: null as string | null,
    sociedadId: null as string | null,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    hasError: (state) => state.status === 'error',
    hasData: (state) => state.documentosGenerados !== null,
  },

  actions: {
    /**
     * Establece la sociedad actual
     */
    setSociedadId(sociedadId: string) {
      this.sociedadId = sociedadId;
    },

    /**
     * Carga la estructura completa de documentos generados
     */
    async cargarDocumentosGenerados(sociedadId?: string) {
      const id = sociedadId || this.sociedadId;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new DocumentosGeneradosMockRepository();
        const useCase = new ListDocumentosGeneradosUseCase(repository);
        const documentos = await useCase.execute(id);

        this.documentosGenerados = documentos;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[DocumentosGeneradosStore] Error al cargar documentos:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar los documentos generados';
      }
    },

    /**
     * Obtiene un documento específico por ID
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
        const repository = new DocumentosGeneradosMockRepository();
        const useCase = new GetDocumentoUseCase(repository);
        const documento = await useCase.execute(id, documentoId);

        this.documentoActual = documento;
        this.status = 'idle';
        return documento;
      } catch (error: any) {
        console.error('[DocumentosGeneradosStore] Error al obtener documento:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos obtener el documento';
        return null;
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

