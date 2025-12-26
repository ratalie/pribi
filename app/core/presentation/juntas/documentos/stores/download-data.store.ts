import { defineStore } from "pinia";
import type { DownloadDataDTO } from "~/core/hexag/documentos/application/dtos/download-data.dto";
import { GetDownloadDataUseCase } from "~/core/hexag/documentos/application/use-cases/get-download-data.use-case";
import { DownloadDataHttpRepository } from "~/core/hexag/documentos/infrastructure/repositories/download-data.http.repository";

/**
 * Store para manejar Download Data de Juntas
 * 
 * Responsabilidades:
 * - Cargar todos los datos de la junta para la vista de descargas
 * - Exponer getters para acceder a los datos de forma cómoda
 */
export const useDownloadDataStore = defineStore("downloadData", {
  state: () => ({
    downloadData: null as DownloadDataDTO | null,
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Si hay datos cargados
     */
    hasData(): boolean {
      return this.downloadData !== null;
    },

    /**
     * Puntos de agenda seleccionados
     */
    agendaItems() {
      return this.downloadData?.agendaItems || null;
    },

    /**
     * Detalles de la junta
     */
    meetingDetails() {
      return this.downloadData?.meetingDetails || null;
    },

    /**
     * Asistencia de accionistas
     */
    attendance() {
      return this.downloadData?.attendance || [];
    },

    /**
     * Datos de aporte dinerario (si existe)
     */
    aporteDinerario() {
      return this.downloadData?.agendaItemsData?.aporteDinerario || null;
    },

    /**
     * Si hay aporte dinerario activo
     */
    hasAporteDinerario(): boolean {
      return this.downloadData?.agendaItems?.aumentoCapital?.aportesDinerarios || false;
    },
  },

  actions: {
    /**
     * Cargar todos los datos de la junta
     */
    async loadDownloadData(societyId: number, flowId: number) {
      this.status = "loading";
      this.errorMessage = null;

      console.debug("[Store][DownloadData] Cargando datos de descarga", {
        societyId,
        flowId,
      });

      try {
        const repository = new DownloadDataHttpRepository();
        const useCase = new GetDownloadDataUseCase(repository);
        this.downloadData = await useCase.execute(societyId, flowId);

        console.log("✅ [Store][DownloadData] Datos cargados exitosamente", {
          hasAgendaItems: !!this.downloadData.agendaItems,
          hasMeetingDetails: !!this.downloadData.meetingDetails,
          attendanceCount: this.downloadData.attendance.length,
          hasAporteDinerario: !!this.downloadData.agendaItemsData?.aporteDinerario,
          aportanteDataCount: this.downloadData.agendaItemsData?.aporteDinerario?.aportanteData?.length || 0,
          aportesDataCount: this.downloadData.agendaItemsData?.aporteDinerario?.aportesData?.length || 0,
        });

        // Log detallado de aportantes para debugging
        if (this.downloadData.agendaItemsData?.aporteDinerario?.aportanteData) {
          console.log("🔍 [Store][DownloadData] Estructura de aportantes:", 
            this.downloadData.agendaItemsData.aporteDinerario.aportanteData.map((a: any) => ({
              id: a.id,
              typeShareholder: a.typeShareholder,
              hasPerson: !!a.person,
              personTipo: a.person?.tipo,
              personKeys: a.person ? Object.keys(a.person) : [],
              personNombre: a.person?.nombre,
              personApellidoPaterno: a.person?.apellidoPaterno,
              personRazonSocial: a.person?.razonSocial,
            }))
          );
        }

        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar datos de descarga";
        console.error("[Store][DownloadData] Error al cargar", error);
        throw error;
      }
    },

    /**
     * Limpiar datos
     */
    clear() {
      this.downloadData = null;
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});

