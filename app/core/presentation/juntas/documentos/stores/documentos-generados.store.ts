import { defineStore } from "pinia";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { DocumentoCategorizerService } from "~/core/hexag/documentos/domain/services/documento-categorizer.service";
import { GenerateAllDocumentosUseCase } from "~/core/hexag/documentos/application/use-cases/generate-all-documentos.use-case";
import type { DownloadDataDTO } from "~/core/hexag/documentos/application/dtos/download-data.dto";

/**
 * Store para manejar Documentos Generados
 * 
 * Responsabilidades:
 * - Generar documentos desde DownloadDataDTO
 * - Guardar documentos generados
 * - Exponer getters para acceder a documentos por categoría
 */
export const useDocumentosGeneradosStore = defineStore("documentosGenerados", {
  state: () => ({
    documentos: [] as Documento[],
    status: "idle" as "idle" | "generating" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Si hay documentos generados
     */
    hasDocumentos(): boolean {
      return this.documentos.length > 0;
    },

    /**
     * Total de documentos
     */
    totalDocumentos(): number {
      return this.documentos.length;
    },

    /**
     * Documentos agrupados por categoría
     */
    documentosPorCategoria(): Record<string, Documento[]> {
      if (this.documentos.length === 0) return {};
      return DocumentoCategorizerService.agruparPorCategoria(this.documentos);
    },

    /**
     * Documentos de acta principal
     */
    actaPrincipal(): Documento | null {
      return this.documentos.find(d => d.categoria === "ACTA_PRINCIPAL") || null;
    },

    /**
     * Documentos de detalles de la junta
     */
    detallesJunta(): Documento[] {
      return this.documentos.filter(d => d.categoria === "DETALLES_JUNTA");
    },

    /**
     * Documentos por punto de acuerdo
     */
    documentosPorPunto(): Documento[] {
      return this.documentos.filter(d => d.categoria === "POR_PUNTO");
    },

    /**
     * Certificados
     */
    certificados(): Documento[] {
      return this.documentos.filter(d => d.categoria === "CERTIFICADOS");
    },
  },

  actions: {
    /**
     * Generar todos los documentos desde DownloadDataDTO
     */
    async generarDocumentos(
      downloadData: DownloadDataDTO,
      razonSocial: string,
      ruc: string
    ) {
      this.status = "generating";
      this.errorMessage = null;

      console.debug("[Store][DocumentosGenerados] Generando documentos...", {
        hasAgendaItems: !!downloadData.agendaItems,
        hasMeetingDetails: !!downloadData.meetingDetails,
        hasAporteDinerario: !!downloadData.agendaItemsData?.aporteDinerario,
      });

      try {
        const useCase = new GenerateAllDocumentosUseCase();
        this.documentos = await useCase.execute(downloadData, razonSocial, ruc);

        console.debug("[Store][DocumentosGenerados] Documentos generados", {
          total: this.documentos.length,
          porCategoria: Object.keys(this.documentosPorCategoria).length,
        });

        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al generar documentos";
        console.error("[Store][DocumentosGenerados] Error al generar", error);
        throw error;
      }
    },

    /**
     * Limpiar documentos
     */
    clear() {
      this.documentos = [];
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});



