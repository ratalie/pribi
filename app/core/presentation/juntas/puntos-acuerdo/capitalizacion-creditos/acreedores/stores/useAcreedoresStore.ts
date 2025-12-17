import { defineStore } from "pinia";
import type { Creditor } from "~/core/hexag/juntas/domain/entities/creditor.entity";
import { CreditorHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/creditor.http.repository";
import { ListCreditorsUseCase } from "~/core/hexag/juntas/application/use-cases/creditor/list-creditors.use-case";
import { CreateCreditorUseCase } from "~/core/hexag/juntas/application/use-cases/creditor/create-creditor.use-case";
import { UpdateCreditorUseCase } from "~/core/hexag/juntas/application/use-cases/creditor/update-creditor.use-case";
import { DeleteCreditorUseCase } from "~/core/hexag/juntas/application/use-cases/creditor/delete-creditor.use-case";
import type { CreateCreditorDTO } from "~/core/hexag/juntas/domain/ports/creditor.repository";
import type { UpdateCreditorDTO } from "~/core/hexag/juntas/domain/ports/creditor.repository";

/**
 * Store para Acreedores (Capitalización de Créditos)
 *
 * Responsabilidades:
 * - Gestionar acreedores (listar, crear, actualizar, eliminar)
 * - Cargar acreedores desde backend
 * - Sincronizar con el backend
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useAcreedoresStore = defineStore("acreedores", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-acreedores",
  },

  state: () => ({
    /** Acreedores cargados desde backend */
    acreedores: [] as Creditor[],

    /** Estado de carga */
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,

    /** IDs de la junta actual */
    currentSocietyId: null as number | null,
    currentFlowId: null as number | null,
  }),

  getters: {
    /**
     * Verificar si hay acreedores cargados
     */
    hasAcreedores(): boolean {
      return this.acreedores.length > 0;
    },

    /**
     * Obtener acreedor por ID
     */
    getAcreedorById: (state) => (acreedorId: string) => {
      return state.acreedores.find((a) => a.id === acreedorId);
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
     * Cargar acreedores desde backend
     * GET /api/v1/society-profile/:societyId/flow/:flowId/creditors
     */
    async loadAcreedores(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;
      this.currentSocietyId = societyId;
      this.currentFlowId = flowId;

      try {
        const repository = new CreditorHttpRepository();
        const useCase = new ListCreditorsUseCase(repository);
        this.acreedores = await useCase.execute(societyId, flowId);

        console.log("[Store][Acreedores] Acreedores cargados:", {
          count: this.acreedores.length,
          acreedores: this.acreedores,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][Acreedores] Error al cargar acreedores:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar acreedores";
        throw error;
      }
    },

    /**
     * Crear nuevo acreedor
     * POST /api/v1/society-profile/:societyId/flow/:flowId/creditors
     */
    async createAcreedor(
      societyId: number,
      flowId: number,
      dto: CreateCreditorDTO
    ): Promise<Creditor> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new CreditorHttpRepository();
        const useCase = new CreateCreditorUseCase(repository);
        const nuevoAcreedor = await useCase.execute(societyId, flowId, dto);

        // Agregar a la lista local
        this.acreedores.push(nuevoAcreedor);

        console.log("[Store][Acreedores] Acreedor creado:", nuevoAcreedor);

        this.status = "idle";
        return nuevoAcreedor;
      } catch (error: any) {
        console.error("[Store][Acreedores] Error al crear acreedor:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al crear acreedor";
        throw error;
      }
    },

    /**
     * Actualizar acreedor existente
     * PUT /api/v1/society-profile/:societyId/flow/:flowId/creditors
     */
    async updateAcreedor(
      societyId: number,
      flowId: number,
      dto: UpdateCreditorDTO
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new CreditorHttpRepository();
        const useCase = new UpdateCreditorUseCase(repository);
        await useCase.execute(societyId, flowId, dto);

        // Actualizar en la lista local
        const index = this.acreedores.findIndex((a) => a.id === dto.id);
        if (index !== -1) {
          // Recargar desde backend para obtener datos actualizados
          await this.loadAcreedores(societyId, flowId);
        }

        console.log("[Store][Acreedores] Acreedor actualizado:", dto.id);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][Acreedores] Error al actualizar acreedor:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar acreedor";
        throw error;
      }
    },

    /**
     * Eliminar acreedores
     * DELETE /api/v1/society-profile/:societyId/flow/:flowId/creditors
     */
    async deleteAcreedores(
      societyId: number,
      flowId: number,
      acreedorIds: string[]
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new CreditorHttpRepository();
        const useCase = new DeleteCreditorUseCase(repository);
        await useCase.execute(societyId, flowId, acreedorIds);

        // Eliminar de la lista local
        this.acreedores = this.acreedores.filter(
          (a) => !acreedorIds.includes(a.id)
        );

        console.log("[Store][Acreedores] Acreedores eliminados:", acreedorIds);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][Acreedores] Error al eliminar acreedores:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al eliminar acreedores";
        throw error;
      }
    },

    /**
     * Limpiar datos
     */
    clear() {
      this.acreedores = [];
      this.status = "idle";
      this.errorMessage = null;
      this.currentSocietyId = null;
      this.currentFlowId = null;
    },
  },
});

