import { defineStore } from "pinia";
import type { CreditCapitalization } from "~/core/hexag/juntas/domain/entities/credit-capitalization.entity";
import { CreditCapitalizationHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/credit-capitalization.http.repository";
import { ListCapitalizationsUseCase } from "~/core/hexag/juntas/application/use-cases/credit-capitalization/list-capitalizations.use-case";
import { CreateCapitalizationUseCase } from "~/core/hexag/juntas/application/use-cases/credit-capitalization/create-capitalization.use-case";
import { UpdateCapitalizationUseCase } from "~/core/hexag/juntas/application/use-cases/credit-capitalization/update-capitalization.use-case";
import { DeleteCapitalizationUseCase } from "~/core/hexag/juntas/application/use-cases/credit-capitalization/delete-capitalization.use-case";
import type { CreateCreditCapitalizationDTO } from "~/core/hexag/juntas/domain/ports/credit-capitalization.repository";
import type { UpdateCreditCapitalizationDTO } from "~/core/hexag/juntas/domain/ports/credit-capitalization.repository";

/**
 * Store para Capitalizaciones de Crédito
 *
 * Responsabilidades:
 * - Gestionar capitalizaciones (listar, crear, actualizar, eliminar)
 * - Cargar capitalizaciones desde backend
 * - Sincronizar con el backend
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useCapitalizacionesStore = defineStore("capitalizaciones", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-capitalizaciones",
  },

  state: () => ({
    /** Capitalizaciones cargadas desde backend */
    capitalizaciones: [] as CreditCapitalization[],

    /** Estado de carga */
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,

    /** IDs de la junta actual */
    currentSocietyId: null as number | null,
    currentFlowId: null as number | null,
  }),

  getters: {
    /**
     * Verificar si hay capitalizaciones cargadas
     */
    hasCapitalizaciones(): boolean {
      return this.capitalizaciones.length > 0;
    },

    /**
     * Obtener capitalización por ID
     */
    getCapitalizacionById: (state) => (capitalizacionId: string) => {
      return state.capitalizaciones.find((c) => c.id === capitalizacionId);
    },

    /**
     * Obtener capitalizaciones por acreedor (shareholderId)
     */
    getCapitalizacionesByAcreedor: (state) => (shareholderId: string) => {
      return state.capitalizaciones.filter((c) => c.shareholderId === shareholderId);
    },
  },

  actions: {
    /**
     * Establece los IDs de la junta actual
     */
    setCurrentJunta(societyId: number | null, flowId: number | null) {
      this.currentSocietyId = societyId;
      this.currentFlowId = flowId;
    },

    /**
     * Cargar capitalizaciones desde backend
     * GET /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
     */
    async loadCapitalizaciones(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;
      this.currentSocietyId = societyId;
      this.currentFlowId = flowId;

      try {
        const repository = new CreditCapitalizationHttpRepository();
        const useCase = new ListCapitalizationsUseCase(repository);
        this.capitalizaciones = await useCase.execute(societyId, flowId);

        console.log("[Store][Capitalizaciones] Capitalizaciones cargadas:", {
          count: this.capitalizaciones.length,
          capitalizaciones: this.capitalizaciones,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][Capitalizaciones] Error al cargar capitalizaciones:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar capitalizaciones";
        throw error;
      }
    },

    /**
     * Crear nueva capitalización
     * POST /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
     */
    async createCapitalizacion(
      societyId: number,
      flowId: number,
      dto: CreateCreditCapitalizationDTO
    ): Promise<CreditCapitalization> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new CreditCapitalizationHttpRepository();
        const useCase = new CreateCapitalizationUseCase(repository);
        const nuevaCapitalizacion = await useCase.execute(societyId, flowId, dto);

        // Agregar a la lista local
        this.capitalizaciones.push(nuevaCapitalizacion);

        console.log("[Store][Capitalizaciones] Capitalización creada:", nuevaCapitalizacion);

        this.status = "idle";
        return nuevaCapitalizacion;
      } catch (error: any) {
        console.error("[Store][Capitalizaciones] Error al crear capitalización:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al crear capitalización";
        throw error;
      }
    },

    /**
     * Actualizar capitalización existente
     * PUT /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
     */
    async updateCapitalizacion(
      societyId: number,
      flowId: number,
      dto: UpdateCreditCapitalizationDTO
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new CreditCapitalizationHttpRepository();
        const useCase = new UpdateCapitalizationUseCase(repository);
        await useCase.execute(societyId, flowId, dto);

        // Recargar desde backend para obtener datos actualizados
        await this.loadCapitalizaciones(societyId, flowId);

        console.log("[Store][Capitalizaciones] Capitalización actualizada:", dto.id);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][Capitalizaciones] Error al actualizar capitalización:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar capitalización";
        throw error;
      }
    },

    /**
     * Eliminar capitalizaciones
     * DELETE /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
     */
    async deleteCapitalizaciones(
      societyId: number,
      flowId: number,
      capitalizacionIds: string[]
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new CreditCapitalizationHttpRepository();
        const useCase = new DeleteCapitalizationUseCase(repository);
        await useCase.execute(societyId, flowId, capitalizacionIds);

        // Eliminar de la lista local
        this.capitalizaciones = this.capitalizaciones.filter(
          (c) => !capitalizacionIds.includes(c.id)
        );

        console.log("[Store][Capitalizaciones] Capitalizaciones eliminadas:", capitalizacionIds);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][Capitalizaciones] Error al eliminar capitalizaciones:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al eliminar capitalizaciones";
        throw error;
      }
    },

    /**
     * Limpiar datos
     */
    clear() {
      this.capitalizaciones = [];
      this.status = "idle";
      this.errorMessage = null;
      this.currentSocietyId = null;
      this.currentFlowId = null;
    },
  },
});



