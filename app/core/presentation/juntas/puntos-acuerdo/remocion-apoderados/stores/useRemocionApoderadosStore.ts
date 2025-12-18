import { defineStore } from "pinia";
import type { RemovalAttorneyResponseDTO } from "~/core/hexag/juntas/application/dtos/removal-attorney.dto";
import { RemovalAttorneyHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/removal-attorney.http.repository";
import { ListRemovalAttorneysUseCase } from "~/core/hexag/juntas/application/use-cases/removal-attorney/list-removal-attorneys.use-case";
import { CreateRemovalAttorneyCandidateUseCase } from "~/core/hexag/juntas/application/use-cases/removal-attorney/create-removal-attorney-candidate.use-case";
import { UpdateRemovalAttorneyCandidateUseCase } from "~/core/hexag/juntas/application/use-cases/removal-attorney/update-removal-attorney-candidate.use-case";

/**
 * Store para Remoción de Apoderados
 *
 * Responsabilidades:
 * - Gestionar apoderados seleccionados para remoción
 * - Cargar candidatos desde backend
 * - Crear candidatos en backend
 * - Actualizar estados de candidatos después de votación
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useRemocionApoderadosStore = defineStore("remocionApoderados", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-remocion-apoderados",
  },

  state: () => ({
    /** IDs de apoderados seleccionados en la vista de selección */
    apoderadosSeleccionados: [] as string[],

    /** Candidatos cargados desde backend */
    candidatos: [] as RemovalAttorneyResponseDTO[],

    /** Estado de carga */
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Verificar si hay candidatos cargados
     */
    hasCandidatos(): boolean {
      return this.candidatos.length > 0;
    },

    /**
     * Verificar si hay apoderados seleccionados
     */
    hasSeleccionados(): boolean {
      return this.apoderadosSeleccionados.length > 0;
    },

    /**
     * Obtener apoderado por ID
     * ✅ El id del registro de remoción ES el attorneyId que se necesita
     */
    getApoderadoById: (state) => (attorneyId: string) => {
      return state.candidatos.find((c) => c.id === attorneyId);
    },
  },

  actions: {
    /**
     * Cargar apoderados disponibles desde backend
     * GET /removal-attorney
     */
    async loadApoderados(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new RemovalAttorneyHttpRepository();
        const useCase = new ListRemovalAttorneysUseCase(repository);
        this.candidatos = await useCase.execute(societyId, flowId);

        console.log("[Store][RemocionApoderados] Apoderados cargados:", {
          count: this.candidatos.length,
          candidatos: this.candidatos,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][RemocionApoderados] Error al cargar apoderados:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar apoderados";
        throw error;
      }
    },

    /**
     * ✅ FUNCIÓN ÚNICA: Actualizar estado de apoderado (marcar/desmarcar)
     * PUT /removal-attorney - Hace TODO: crear, actualizar, desmarcar
     *
     * @param candidatoEstado - "CANDIDATO" (marcar), "DESMARCAR" (desmarcar), "ELEGIDO", "NO_ELEGIDO"
     */
    async actualizarEstado(
      societyId: number,
      flowId: number,
      attorneyId: string,
      candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new RemovalAttorneyHttpRepository();
        const useCase = new CreateRemovalAttorneyCandidateUseCase(repository);

        // ✅ PUT hace todo automáticamente (crea si no existe, actualiza si existe)
        await useCase.execute(societyId, flowId, attorneyId, candidatoEstado);

        console.log(
          `[Store][RemocionApoderados] ✅ Estado actualizado para apoderado ${attorneyId}: ${candidatoEstado}`
        );

        // Recargar candidatos para obtener datos actualizados
        await this.loadApoderados(societyId, flowId);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][RemocionApoderados] Error al actualizar estado:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar estado";
        throw error;
      }
    },

    /**
     * @deprecated Usar actualizarEstado() en su lugar
     * Crear candidatos a remoción en backend (múltiples)
     */
    async createCandidatos(
      societyId: number,
      flowId: number,
      attorneyIds: string[]
    ): Promise<void> {
      if (attorneyIds.length === 0) {
        console.warn("[Store][RemocionApoderados] No hay apoderados para crear candidatos");
        return;
      }

      this.status = "loading";
      this.errorMessage = null;

      try {
        // ✅ Usar la función única para cada apoderado
        for (const attorneyId of attorneyIds) {
          try {
            await this.actualizarEstado(societyId, flowId, attorneyId, "CANDIDATO");
          } catch (error: any) {
            console.error(
              `[Store][RemocionApoderados] ⚠️ Error al marcar apoderado ${attorneyId}:`,
              error
            );
            // Continuar con el siguiente
          }
        }

        // Guardar selección en state
        this.apoderadosSeleccionados = attorneyIds;

        console.log("[Store][RemocionApoderados] Candidatos creados exitosamente:", {
          count: attorneyIds.length,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][RemocionApoderados] Error al crear candidatos:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al crear candidatos";
        throw error;
      }
    },

    /**
     * @deprecated Usar actualizarEstado() en su lugar
     * Actualizar estado de candidato después de votación
     */
    async updateEstadoCandidato(
      societyId: number,
      flowId: number,
      attorneyId: string,
      estado: "ELEGIDO" | "NO_ELEGIDO"
    ): Promise<void> {
      // ✅ Redirigir a la función única
      await this.actualizarEstado(societyId, flowId, attorneyId, estado);
    },

    /**
     * Limpiar selección
     */
    clearSeleccion() {
      this.apoderadosSeleccionados = [];
    },
  },
});

