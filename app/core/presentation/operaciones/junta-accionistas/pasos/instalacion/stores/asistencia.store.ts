/**
 * Store para Instalación de la Junta (Asistencia)
 * 
 * Gestiona:
 * - Asistencia de accionistas
 * - Representación
 * - Cálculo de quorum
 * - Mesa directiva
 * 
 * @architecture Pinia Option API
 * @layer Presentation
 */

import { defineStore } from "pinia";
import { GetAsistenciaUseCase } from "~/core/hexag/juntas/application/use-cases/asistencia/get-asistencia.use-case";
import { UpdateAsistenciaUseCase } from "~/core/hexag/juntas/application/use-cases/asistencia/update-asistencia.use-case";
import { AsistenciaHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/asistencia.http.repository";
import type { Asistencia } from "~/core/hexag/juntas/domain/entities/asistencia.entity";

interface AsistenciaState {
  // Data
  asistencia: Asistencia | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Meta
  societyId: number | null;
  flowId: string | null;
}

export const useAsistenciaStore = defineStore("asistencia", {
  // ========================================
  // STATE
  // ========================================
  state: (): AsistenciaState => ({
    asistencia: null,
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
     * Asistentes
     */
    asistentes(state) {
      return state.asistencia?.asistentes || [];
    },

    /**
     * Representantes
     */
    representantes(state) {
      return state.asistencia?.representantes || [];
    },

    /**
     * Quorum
     */
    quorum(state) {
      return state.asistencia?.quorum || null;
    },

    /**
     * Mesa directiva
     */
    mesaDirectiva(state) {
      // TODO: Implementar según estructura de Asistencia entity
      return null;
    },

    /**
     * ¿Hay quorum?
     */
    hasQuorum(state): boolean {
      return state.asistencia?.quorum?.alcanzado || false;
    },

    /**
     * Total de capital presente
     */
    capitalPresente(state): number {
      return state.asistencia?.quorum?.capitalPresente || 0;
    },

    /**
     * Porcentaje de asistencia
     */
    porcentajeAsistencia(state): number {
      return state.asistencia?.quorum?.porcentajeAsistencia || 0;
    },

    /**
     * ¿Está completo?
     */
    isComplete(state): boolean {
      if (!state.asistencia) return false;

      const hasAsistentes = (state.asistencia.asistentes?.length || 0) > 0;
      const hasMesaDirectiva = !!state.asistencia.mesaDirectiva;

      return hasAsistentes && hasMesaDirectiva;
    },

    /**
     * ¿Está listo para continuar?
     */
    isReadyToContinue(state): boolean {
      return this.isComplete && this.hasQuorum && !state.loading;
    },
  },

  // ========================================
  // ACTIONS
  // ========================================
  actions: {
    /**
     * Carga la asistencia desde el backend
     */
    async load(societyId: number, flowId: string) {
      this.loading = true;
      this.error = null;
      this.societyId = societyId;
      this.flowId = flowId;

      try {
        const repository = new AsistenciaHttpRepository();
        const useCase = new GetAsistenciaUseCase(repository);
        
        const asistencia = await useCase.execute(societyId, flowId);
        this.asistencia = asistencia;
        
        console.log("[AsistenciaStore] Loaded asistencia:", asistencia);
      } catch (error: any) {
        console.error("[AsistenciaStore] Error loading asistencia:", error);
        this.error = error.message || "Error al cargar asistencia";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Guarda la asistencia en el backend
     */
    async save() {
      if (!this.societyId || !this.flowId || !this.asistencia) {
        throw new Error("No se puede guardar: faltan datos");
      }

      this.loading = true;
      this.error = null;

      try {
        const repository = new AsistenciaHttpRepository();
        const useCase = new UpdateAsistenciaUseCase(repository);
        
        await useCase.execute(this.societyId, this.flowId, this.asistencia);
        
        console.log("[AsistenciaStore] Saved asistencia");
      } catch (error: any) {
        console.error("[AsistenciaStore] Error saving asistencia:", error);
        this.error = error.message || "Error al guardar asistencia";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Marca un accionista como asistente
     */
    markAsistente(accionistaId: string, data: any) {
      // TODO: Implementar según estructura de Asistencia
      console.log(`[AsistenciaStore] Mark asistente: ${accionistaId}`, data);
    },

    /**
     * Remueve un asistente
     */
    removeAsistente(accionistaId: string) {
      // TODO: Implementar según estructura de Asistencia
      console.log(`[AsistenciaStore] Remove asistente: ${accionistaId}`);
    },

    /**
     * Actualiza la mesa directiva
     */
    setMesaDirectiva(mesaDirectiva: any) {
      // TODO: Implementar según estructura de MeetingDetails (no Asistencia)
      // La mesa directiva está en MeetingDetails, no en Asistencia
      console.log(`[AsistenciaStore] Set mesa directiva:`, mesaDirectiva);
    },

    /**
     * Limpia el estado
     */
    clear() {
      this.asistencia = null;
      this.loading = false;
      this.error = null;
      this.societyId = null;
      this.flowId = null;
    },
  },
});

