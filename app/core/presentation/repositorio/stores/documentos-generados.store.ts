import { defineStore } from 'pinia';
import { ObtenerDocumentosJuntasUseCase } from '~/core/hexag/repositorio/application/use-cases/obtener-documentos-juntas.use-case';
import { RepositorioDocumentosHttpRepository } from '~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository';
import type { RepositorioNode } from '~/core/hexag/repositorio/domain/entities/repositorio-node.entity';

type Status = 'idle' | 'loading' | 'error';

/**
 * Estructura de documentos generados para la vista
 * Compatible con la estructura esperada por DocumentosGeneradosView.vue
 */
interface EstructuraJuntas {
  operaciones: {
    juntas: RepositorioNode[];
  };
}

/**
 * Store para Documentos Generados
 * Usa Option API según las reglas del proyecto
 */
export const useDocumentosGeneradosStore = defineStore('documentos-generados', {
  state: () => ({
    estructuraJuntas: null as EstructuraJuntas | null,
    documentosCarpeta: [] as RepositorioNode[],
    carpetaActual: null as string | null,
    status: 'idle' as Status,
    errorMessage: null as string | null,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    hasError: (state) => state.status === 'error',
    hasData: (state) => state.estructuraJuntas !== null,
  },

  actions: {
    /**
     * Carga la estructura completa de documentos generados de juntas
     */
    async cargarDocumentosGenerados(structureId: string) {
      console.log("🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId:", structureId);
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new RepositorioDocumentosHttpRepository();
        const useCase = new ObtenerDocumentosJuntasUseCase(repository);
        console.log("🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...");
        this.estructuraJuntas = await useCase.obtenerEstructuraJuntas(structureId);
        console.log("🟢 [DocumentosGeneradosStore] Estructura obtenida:", {
          totalJuntas: this.estructuraJuntas?.operaciones?.juntas?.length || 0,
        });
        this.status = 'idle';
      } catch (error: any) {
        console.error('[DocumentosGeneradosStore] Error al cargar documentos:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar los documentos generados';
        throw error;
      }
    },

    /**
     * Carga los documentos dentro de una carpeta de junta
     */
    async cargarDocumentosDeCarpeta(carpetaId: string) {
      this.status = 'loading';
      this.errorMessage = null;
      this.carpetaActual = carpetaId;

      try {
        const repository = new RepositorioDocumentosHttpRepository();
        const useCase = new ObtenerDocumentosJuntasUseCase(repository);
        this.documentosCarpeta = await useCase.obtenerDocumentosDeCarpeta(carpetaId);
        this.status = 'idle';
      } catch (error: any) {
        console.error('[DocumentosGeneradosStore] Error al cargar documentos de carpeta:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar los documentos de la carpeta';
        throw error;
      }
    },

    /**
     * Obtiene un documento específico por su ID
     */
    async obtenerDocumento(documentoId: string) {
      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new RepositorioDocumentosHttpRepository();
        const documento = await repository.obtenerNodoPorId(documentoId);
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
     * Limpia los datos del store
     */
    limpiar() {
      this.estructuraJuntas = null;
      this.documentosCarpeta = [];
      this.carpetaActual = null;
      this.errorMessage = null;
      this.status = 'idle';
    },
  },
});

