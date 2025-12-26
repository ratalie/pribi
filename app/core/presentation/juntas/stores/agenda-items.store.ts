import { defineStore } from "pinia";
import {
  GetAgendaItemsUseCase,
  UpdateAgendaItemsUseCase,
} from "~/core/hexag/juntas/application/use-cases";
import type { AgendaItemsDTO } from "~/core/hexag/juntas/application/dtos/agenda-item.dto";
import { AgendaItemsHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/agenda-items.http.repository";
import { createDefaultAgendaItemsDTO } from "~/core/hexag/juntas/application/dtos/agenda-item.dto";

type Status = "idle" | "loading" | "error";

/**
 * Store para gestionar los puntos de agenda de una junta
 * 
 * Usa Option API de Pinia (NO Composition API)
 */
export const useAgendaItemsStore = defineStore("agenda-items", {
  state: () => ({
    // Datos actuales de agenda items
    agendaItems: null as AgendaItemsDTO | null,
    
    // Estado de carga
    status: "idle" as Status,
    errorMessage: null as string | null,
    
    // IDs de la junta actual
    currentSocietyId: null as number | null,
    currentFlowId: null as number | null,
  }),

  getters: {
    /**
     * Indica si hay datos cargados
     */
    hasData: (state) => state.agendaItems !== null,

    /**
     * Indica si está cargando
     */
    isLoading: (state) => state.status === "loading",
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
     * Carga los puntos de agenda desde el backend
     */
    async loadAgendaItems(societyId: number, flowId: number): Promise<void> {
      if (!societyId || !flowId) {
        this.errorMessage = "Debes proporcionar societyId y flowId.";
        return;
      }

      this.status = "loading";
      this.errorMessage = null;
      this.currentSocietyId = societyId;
      this.currentFlowId = flowId;

      const repository = new AgendaItemsHttpRepository();
      const getUseCase = new GetAgendaItemsUseCase(repository);

      try {
        const result = await getUseCase.execute(societyId, flowId);
        console.debug("[Store][AgendaItems] Agenda items cargados", result);
        this.agendaItems = result;
        this.status = "idle";
      } catch (error) {
        const statusCode =
          (error as any)?.statusCode ?? (error as any)?.response?.status ?? null;
        const message =
          (error as any)?.data?.message ??
          (error as any)?.response?._data?.message ??
          (error as any)?.message ??
          "Error desconocido";
        console.error("[Store][AgendaItems] Error al cargar agenda items:", {
          statusCode,
          message,
        });
        this.status = "error";
        this.errorMessage =
          statusCode === 401
            ? "Tu sesión expiró o el token no es válido. Inicia sesión nuevamente."
            : "No pudimos cargar los puntos de agenda.";
        // Si hay error, usar valores por defecto
        this.agendaItems = createDefaultAgendaItemsDTO();
      }
    },

    /**
     * Guarda los puntos de agenda en el backend
     */
    async saveAgendaItems(
      societyId: number,
      flowId: number,
      payload: AgendaItemsDTO
    ): Promise<void> {
      if (!societyId || !flowId) {
        throw new Error("Debes proporcionar societyId y flowId.");
      }

      this.status = "loading";
      this.errorMessage = null;

      const repository = new AgendaItemsHttpRepository();
      const updateUseCase = new UpdateAgendaItemsUseCase(repository);

      try {
        await updateUseCase.execute(societyId, flowId, payload);
        console.debug("[Store][AgendaItems] Agenda items guardados", payload);
        // Actualizar el estado local con los datos guardados
        this.agendaItems = payload;
        this.currentSocietyId = societyId;
        this.currentFlowId = flowId;
        this.status = "idle";
      } catch (error) {
        const statusCode =
          (error as any)?.statusCode ?? (error as any)?.response?.status ?? null;
        const message =
          (error as any)?.data?.message ??
          (error as any)?.response?._data?.message ??
          (error as any)?.message ??
          "Error desconocido";
        console.error("[Store][AgendaItems] Error al guardar agenda items:", {
          statusCode,
          message,
        });
        this.status = "error";
        this.errorMessage =
          statusCode === 401
            ? "Tu sesión expiró o el token no es válido. Inicia sesión nuevamente."
            : "No pudimos guardar los puntos de agenda.";
        throw error;
      }
    },

    /**
     * Limpia el estado del store
     */
    clear() {
      this.agendaItems = null;
      this.status = "idle";
      this.errorMessage = null;
      this.currentSocietyId = null;
      this.currentFlowId = null;
    },
  },
});

