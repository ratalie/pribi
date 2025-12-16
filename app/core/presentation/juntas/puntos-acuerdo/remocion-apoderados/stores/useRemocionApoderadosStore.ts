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
     */
    getApoderadoById: (state) => (attorneyId: string) => {
      return state.candidatos.find((c) => c.attorneyId === attorneyId);
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
     * Crear candidatos a remoción en backend
     * POST /removal-attorney (múltiples llamadas, una por apoderado)
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
        const repository = new RemovalAttorneyHttpRepository();
        const useCase = new CreateRemovalAttorneyCandidateUseCase(repository);

        // Crear candidatos uno por uno
        for (const attorneyId of attorneyIds) {
          await useCase.execute(societyId, flowId, attorneyId, "CANDIDATO");
          console.log(
            `[Store][RemocionApoderados] Candidato creado para apoderado: ${attorneyId}`
          );
        }

        // Guardar selección en state
        this.apoderadosSeleccionados = attorneyIds;

        // Recargar candidatos para obtener datos actualizados
        await this.loadApoderados(societyId, flowId);

        console.log("[Store][RemocionApoderados] Candidatos creados exitosamente:", {
          count: attorneyIds.length,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error(
          "[Store][RemocionApoderados] Error al crear candidatos:",
          error
        );
        this.status = "error";
        this.errorMessage = error.message || "Error al crear candidatos";
        throw error;
      }
    },

    /**
     * Actualizar estado de candidato después de votación
     * PUT /removal-attorney
     */
    async updateEstadoCandidato(
      societyId: number,
      flowId: number,
      attorneyId: string,
      estado: "ELEGIDO" | "NO_ELEGIDO"
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new RemovalAttorneyHttpRepository();
        const useCase = new UpdateRemovalAttorneyCandidateUseCase(repository);
        await useCase.execute(societyId, flowId, attorneyId, estado);

        console.log(
          `[Store][RemocionApoderados] Estado actualizado para apoderado ${attorneyId}: ${estado}`
        );

        // Actualizar estado local del candidato
        const candidato = this.candidatos.find((c) => c.attorneyId === attorneyId);
        if (candidato && candidato.attorneyFlowActions.length > 0) {
          candidato.attorneyFlowActions[0].candidateStatus =
            estado === "ELEGIDO" ? "ELECTED" : "NOT_ELECTED";
        }

        this.status = "idle";
      } catch (error: any) {
        console.error(
          "[Store][RemocionApoderados] Error al actualizar estado:",
          error
        );
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar estado";
        throw error;
      }
    },

    /**
     * Limpiar selección
     */
    clearSeleccion() {
      this.apoderadosSeleccionados = [];
    },
  },
});

