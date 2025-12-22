import { defineStore } from "pinia";
import { ObtenerDocumentosJuntasUseCase } from "~/core/hexag/repositorio/application/use-cases/obtener-documentos-juntas.use-case";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

type Status = "idle" | "loading" | "error";

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
 * Estructura de operaciones (directorio y juntas)
 */
interface EstructuraOperaciones {
  directorio: RepositorioNode | null;
  juntas: RepositorioNode | null;
}

/**
 * Estructura de registros (sociedades y sucursales)
 */
interface EstructuraRegistros {
  sociedades: RepositorioNode | null;
  sucursales: RepositorioNode | null;
}

/**
 * Store para Documentos Generados
 * Usa Option API según las reglas del proyecto
 */
export const useDocumentosGeneradosStore = defineStore("documentos-generados", {
  state: () => ({
    estructuraJuntas: null as EstructuraJuntas | null,
    estructuraOperaciones: null as EstructuraOperaciones | null,
    estructuraRegistros: null as EstructuraRegistros | null,
    documentosCarpeta: [] as RepositorioNode[],
    carpetaActual: null as string | null,
    status: "idle" as Status,
    errorMessage: null as string | null,
  }),

  getters: {
    isLoading: (state) => state.status === "loading",
    hasError: (state) => state.status === "error",
    hasData: (state) => state.estructuraJuntas !== null,
  },

  actions: {
    /**
     * Carga la estructura completa de documentos generados de juntas
     */
    async cargarDocumentosGenerados(structureId: string) {
      console.log(
        "🟢 [DocumentosGeneradosStore] Cargando documentos generados para structureId:",
        structureId
      );
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new RepositorioDocumentosHttpRepository();
        const useCase = new ObtenerDocumentosJuntasUseCase(repository);

        // Cargar estructura de operaciones (directorio y juntas)
        console.log(
          "🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraOperaciones..."
        );
        this.estructuraOperaciones = await useCase.obtenerEstructuraOperaciones(structureId);

        // Cargar estructura de registros (sociedades y sucursales)
        console.log("🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraRegistros...");
        this.estructuraRegistros = await useCase.obtenerEstructuraRegistros(structureId);

        // Cargar estructura de juntas (carpetas de juntas individuales)
        console.log("🟢 [DocumentosGeneradosStore] Llamando a obtenerEstructuraJuntas...");
        this.estructuraJuntas = await useCase.obtenerEstructuraJuntas(structureId);

        console.log("🟢 [DocumentosGeneradosStore] Estructura obtenida:", {
          operaciones: {
            directorio: this.estructuraOperaciones?.directorio?.id || null,
            juntas: this.estructuraOperaciones?.juntas?.id || null,
          },
          registros: {
            sociedades: this.estructuraRegistros?.sociedades?.id || null,
            sucursales: this.estructuraRegistros?.sucursales?.id || null,
          },
          totalJuntas: this.estructuraJuntas?.operaciones?.juntas?.length || 0,
        });
        this.status = "idle";
      } catch (error: any) {
        console.error("[DocumentosGeneradosStore] Error al cargar documentos:", error);
        this.status = "error";
        this.errorMessage = error?.message ?? "No pudimos cargar los documentos generados";
        throw error;
      }
    },

    /**
     * Carga los documentos dentro de una carpeta de junta
     *
     * Protección contra loops infinitos: si la carpeta ya está cargada y está vacía,
     * no volver a cargarla.
     */
    async cargarDocumentosDeCarpeta(carpetaId: string) {
      // Protección: si ya está cargada la misma carpeta y está vacía, no volver a cargar
      if (
        this.carpetaActual === carpetaId &&
        this.documentosCarpeta.length === 0 &&
        this.status === "idle"
      ) {
        console.log(
          "[DocumentosGeneradosStore] Carpeta ya está cargada y está vacía, evitando recarga:",
          carpetaId
        );
        return;
      }

      // Si ya está cargando la misma carpeta, no volver a cargar
      if (this.carpetaActual === carpetaId && this.status === "loading") {
        console.log(
          "[DocumentosGeneradosStore] Carpeta ya se está cargando, evitando recarga:",
          carpetaId
        );
        return;
      }

      this.status = "loading";
      this.errorMessage = null;
      this.carpetaActual = carpetaId;

      try {
        const repository = new RepositorioDocumentosHttpRepository();
        const useCase = new ObtenerDocumentosJuntasUseCase(repository);
        this.documentosCarpeta = await useCase.obtenerDocumentosDeCarpeta(carpetaId);
        this.status = "idle";
        console.log("[DocumentosGeneradosStore] Documentos de carpeta cargados:", {
          carpetaId,
          cantidad: this.documentosCarpeta.length,
        });
      } catch (error: any) {
        console.error(
          "[DocumentosGeneradosStore] Error al cargar documentos de carpeta:",
          error
        );
        this.status = "error";
        this.errorMessage = error?.message ?? "No pudimos cargar los documentos de la carpeta";
        throw error;
      }
    },

    /**
     * Obtiene un documento específico por su ID
     */
    async obtenerDocumento(documentoId: string) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new RepositorioDocumentosHttpRepository();
        const documento = await repository.obtenerNodoPorId(documentoId);
        this.status = "idle";
        return documento;
      } catch (error: any) {
        console.error("[DocumentosGeneradosStore] Error al obtener documento:", error);
        this.status = "error";
        this.errorMessage = error?.message ?? "No pudimos obtener el documento";
        return null;
      }
    },

    /**
     * Limpia los datos del store
     */
    limpiar() {
      this.estructuraJuntas = null;
      this.estructuraOperaciones = null;
      this.estructuraRegistros = null;
      this.documentosCarpeta = [];
      this.carpetaActual = null;
      this.errorMessage = null;
      this.status = "idle";
    },
  },
});
