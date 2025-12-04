/**
 * Store para Detalles de la Junta
 * 
 * Gestiona todos los detalles de configuración de la junta:
 * - Tipo de junta (Universal/General)
 * - Convocatoria (fechas, plazos, modo)
 * - Lugar de celebración
 * - Presidencia y Secretaría
 * 
 * @architecture Pinia Option API
 * @layer Presentation
 */

import { defineStore } from "pinia";
import { GetMeetingDetailsUseCase } from "~/core/hexag/juntas/application/use-cases/get-meeting-details.use-case";
import { UpdateMeetingDetailsUseCase } from "~/core/hexag/juntas/application/use-cases/update-meeting-details.use-case";
import { MeetingDetailsHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/meeting-details.http.repository";
import type { MeetingDetails } from "~/core/hexag/juntas/domain/entities/meeting-details.entity";
import { TipoJunta } from "~/core/hexag/juntas/domain/enums/tipo-junta.enum";

interface MeetingDetailsState {
  // Data
  details: MeetingDetails | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Meta
  societyId: number | null;
  flowId: string | null;
}

export const useMeetingDetailsStore = defineStore("meetingDetails", {
  // ========================================
  // STATE
  // ========================================
  state: (): MeetingDetailsState => ({
    details: null,
    loading: false,
    error: null,
    societyId: null,
    flowId: null,
  }),

  // ========================================
  // GETTERS
  // ========================================
  getters: {
    /**
     * Tipo de junta
     */
    tipoJunta(state): TipoJunta | null {
      return state.details?.tipoJunta || null;
    },

    /**
     * ¿Es junta universal?
     */
    isUniversal(state): boolean {
      return state.details?.tipoJunta === TipoJunta.UNIVERSAL;
    },

    /**
     * ¿Es junta general?
     */
    isGeneral(state): boolean {
      return state.details?.tipoJunta === TipoJunta.GENERAL;
    },

    /**
     * Convocatoria (primera)
     */
    convocatoria(state) {
      return state.details?.primeraConvocatoria || null;
    },

    /**
     * Lugar
     */
    lugar(state) {
      // MeetingDetails no tiene campo 'lugar' separado
      return state.details?.primeraConvocatoria || null;
    },

    /**
     * Presidencia
     */
    presidencia(state) {
      // Presidente y secretario están en MeetingDetails directamente
      return {
        presidenteId: state.details?.presidenteId || null,
        secretarioId: state.details?.secretarioId || null,
      };
    },

    /**
     * ¿Está completo?
     */
    isComplete(state): boolean {
      if (!state.details) return false;

      const hasType = !!state.details.tipoJunta;
      const hasConvocatoria = !!state.details.primeraConvocatoria;

      return hasType && (state.details.tipoJunta === TipoJunta.UNIVERSAL || hasConvocatoria);
    },

    /**
     * ¿Está listo para continuar?
     */
    isReadyToContinue(state): boolean {
      return this.isComplete && !state.loading;
    },
  },

  // ========================================
  // ACTIONS
  // ========================================
  actions: {
    /**
     * Carga los detalles desde el backend
     */
    async load(societyId: number, flowId: string) {
      this.loading = true;
      this.error = null;
      this.societyId = societyId;
      this.flowId = flowId;

      try {
        const repository = new MeetingDetailsHttpRepository();
        const useCase = new GetMeetingDetailsUseCase(repository);
        
        const details = await useCase.execute(societyId, Number(flowId));
        this.details = details;
        
        console.log("[MeetingDetailsStore] Loaded details:", details);
      } catch (error: any) {
        console.error("[MeetingDetailsStore] Error loading details:", error);
        this.error = error.message || "Error al cargar detalles de la junta";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Guarda los detalles en el backend
     */
    async save() {
      if (!this.societyId || !this.flowId || !this.details) {
        throw new Error("No se puede guardar: faltan datos");
      }

      this.loading = true;
      this.error = null;

      try {
        const repository = new MeetingDetailsHttpRepository();
        const useCase = new UpdateMeetingDetailsUseCase(repository);
        
        await useCase.execute(this.societyId, Number(this.flowId), this.details);
        
        console.log("[MeetingDetailsStore] Saved details");
      } catch (error: any) {
        console.error("[MeetingDetailsStore] Error saving details:", error);
        this.error = error.message || "Error al guardar detalles";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Actualiza el tipo de junta
     */
    setTipoJunta(tipo: TipoJunta) {
      if (!this.details) {
        this.details = { tipoJunta: tipo } as MeetingDetails;
      } else {
        this.details.tipoJunta = tipo;
      }
    },

    /**
     * Actualiza la convocatoria
     */
    setConvocatoria(convocatoria: any) {
      if (!this.details) {
        this.details = { primeraConvocatoria: convocatoria } as MeetingDetails;
      } else {
        this.details.primeraConvocatoria = convocatoria;
      }
    },

    /**
     * Actualiza el lugar
     */
    setLugar(lugar: any) {
      // Lugar está dentro de convocatoria
      if (this.details) {
        if (this.details.primeraConvocatoria) {
          this.details.primeraConvocatoria.direccion = lugar.direccion || '';
        }
      }
    },

    /**
     * Actualiza la presidencia
     */
    setPresidencia(presidencia: any) {
      if (this.details) {
        this.details.presidenteId = presidencia.presidenteId;
        this.details.secretarioId = presidencia.secretarioId;
      }
    },

    /**
     * Inicializa los detalles si no existen
     */
    ensureInitialized() {
      if (!this.details) {
        this.details = {
          tipo: TipoJunta.GENERAL,
        } as MeetingDetails;
      }
    },

    /**
     * Limpia el estado
     */
    clear() {
      this.details = null;
      this.loading = false;
      this.error = null;
      this.societyId = null;
      this.flowId = null;
    },
  },
});

