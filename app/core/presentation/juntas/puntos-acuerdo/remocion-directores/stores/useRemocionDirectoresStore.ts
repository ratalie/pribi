import { defineStore } from "pinia";
import type { RemovalDirectorResponseDTO } from "~/core/hexag/juntas/application/dtos/removal-director.dto";
import { CreateRemovalDirectorCandidateUseCase } from "~/core/hexag/juntas/application/use-cases/removal-director/create-removal-director-candidate.use-case";
import { ListRemovalDirectorsUseCase } from "~/core/hexag/juntas/application/use-cases/removal-director/list-removal-directors.use-case";
import { RemovalDirectorHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/removal-director.http.repository";

/**
 * Store para Remoción de Directores
 *
 * Responsabilidades:
 * - Gestionar directores seleccionados para remoción
 * - Cargar candidatos desde backend
 * - Crear candidatos en backend
 * - Actualizar estados de candidatos después de votación
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useRemocionDirectoresStore = defineStore("remocionDirectores", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-remocion-directores",
  },

  state: () => ({
    /** IDs de directores seleccionados en la vista de selección */
    directoresSeleccionados: [] as string[],

    /** Candidatos cargados desde backend */
    candidatos: [] as RemovalDirectorResponseDTO[],

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
     * Verificar si hay directores seleccionados
     */
    hasSeleccionados(): boolean {
      return this.directoresSeleccionados.length > 0;
    },

    /**
     * Obtener director por ID
     * ✅ El id del backend ES el directorId que se usa en POST/PUT
     */
    getDirectorById: (state) => (directorId: string) => {
      return state.candidatos.find((c) => c.id === directorId);
    },
  },

  actions: {
    /**
     * Cargar directores disponibles desde backend
     * GET /removal-director
     */
    async loadDirectores(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new RemovalDirectorHttpRepository();
        const useCase = new ListRemovalDirectorsUseCase(repository);
        this.candidatos = await useCase.execute(societyId, flowId);

        console.log("[Store][RemocionDirectores] Directores cargados:", {
          count: this.candidatos.length,
          candidatos: this.candidatos,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][RemocionDirectores] Error al cargar directores:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar directores";
        throw error;
      }
    },

    /**
     * ✅ FUNCIÓN ÚNICA: Actualizar estado de director (marcar/desmarcar)
     * PUT /removal-director - Hace TODO: crear, actualizar, desmarcar
     *
     * @param candidatoEstado - "CANDIDATO" (marcar), "DESMARCAR" (desmarcar), "ELEGIDO", "NO_ELEGIDO"
     */
    async actualizarEstado(
      societyId: number,
      flowId: number,
      directorId: string,
      candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new RemovalDirectorHttpRepository();
        const useCase = new CreateRemovalDirectorCandidateUseCase(repository);

        // ✅ PUT hace todo automáticamente (crea si no existe, actualiza si existe)
        await useCase.execute(societyId, flowId, directorId, candidatoEstado);

        console.log(
          `[Store][RemocionDirectores] ✅ Estado actualizado para director ${directorId}: ${candidatoEstado}`
        );

        // Recargar candidatos para obtener datos actualizados
        await this.loadDirectores(societyId, flowId);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][RemocionDirectores] Error al actualizar estado:", error);
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
      directorIds: string[]
    ): Promise<void> {
      if (directorIds.length === 0) {
        console.warn("[Store][RemocionDirectores] No hay directores para crear candidatos");
        return;
      }

      this.status = "loading";
      this.errorMessage = null;

      try {
        // ✅ Usar la función única para cada director
        for (const directorId of directorIds) {
          try {
            await this.actualizarEstado(societyId, flowId, directorId, "CANDIDATO");
          } catch (error: any) {
            console.error(
              `[Store][RemocionDirectores] ⚠️ Error al marcar director ${directorId}:`,
              error
            );
            // Continuar con el siguiente
          }
        }

        // Guardar selección en state
        this.directoresSeleccionados = directorIds;

        console.log("[Store][RemocionDirectores] Candidatos creados exitosamente:", {
          count: directorIds.length,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][RemocionDirectores] Error al crear candidatos:", error);
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
      directorId: string,
      estado: "ELEGIDO" | "NO_ELEGIDO"
    ): Promise<void> {
      // ✅ Redirigir a la función única
      await this.actualizarEstado(societyId, flowId, directorId, estado);
    },

    /**
     * Limpiar selección
     */
    clearSeleccion() {
      this.directoresSeleccionados = [];
    },
  },
});
