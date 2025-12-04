/**
 * Store para Selección de Puntos de Agenda
 * 
 * Gestiona los puntos de agenda seleccionados para una junta.
 * 
 * @architecture Pinia Option API
 * @layer Presentation
 */

import { defineStore } from "pinia";
import { GetAgendaItemsUseCase } from "~/core/hexag/juntas/application/use-cases/get-agenda-items.use-case";
import { UpdateAgendaItemsUseCase } from "~/core/hexag/juntas/application/use-cases/update-agenda-items.use-case";
import { AgendaItemsHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/agenda-items.http.repository";
import type { AgendaItemsDTO } from "~/core/hexag/juntas/application/dtos/agenda-item.dto";

interface AgendaItemsState {
  // Data
  items: AgendaItemsDTO | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Meta
  societyId: number | null;
  flowId: string | null;
}

export const useAgendaItemsStore = defineStore("agendaItems", {
  // ========================================
  // STATE
  // ========================================
  state: (): AgendaItemsState => ({
    items: null,
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
     * Puntos seleccionados
     */
    selectedItems(state): any[] {
      if (!state.items) return [];
      const items = (state.items as any).items || [];
      return items.filter((item: any) => item.selected);
    },

    /**
     * IDs de puntos seleccionados
     */
    selectedItemIds(state): string[] {
      return this.selectedItems.map((item: any) => item.id);
    },

    /**
     * Cantidad de puntos seleccionados
     */
    selectedCount(state): number {
      return this.selectedItems.length;
    },

    /**
     * ¿Hay puntos seleccionados?
     */
    hasSelectedItems(state): boolean {
      return this.selectedItems.length > 0;
    },

    /**
     * ¿Está listo para continuar?
     */
    isReadyToContinue(state): boolean {
      return this.hasSelectedItems && !state.loading;
    },
  },

  // ========================================
  // ACTIONS
  // ========================================
  actions: {
    /**
     * Carga los puntos de agenda desde el backend
     */
    async load(societyId: number, flowId: string) {
      this.loading = true;
      this.error = null;
      this.societyId = societyId;
      this.flowId = flowId;

      try {
        const repository = new AgendaItemsHttpRepository();
        const useCase = new GetAgendaItemsUseCase(repository);
        
        const items = await useCase.execute(societyId, Number(flowId));
        this.items = items;
        
        console.log(`[AgendaItemsStore] Loaded agenda items`);
      } catch (error: any) {
        console.error("[AgendaItemsStore] Error loading items:", error);
        this.error = error.message || "Error al cargar puntos de agenda";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Guarda los puntos seleccionados en el backend
     */
    async save() {
      if (!this.societyId || !this.flowId || !this.items) {
        throw new Error("No se puede guardar: falta societyId o flowId");
      }

      this.loading = true;
      this.error = null;

      try {
        const repository = new AgendaItemsHttpRepository();
        const useCase = new UpdateAgendaItemsUseCase(repository);
        
        await useCase.execute(this.societyId, Number(this.flowId), this.items);
        
        console.log(`[AgendaItemsStore] Saved agenda items`);
      } catch (error: any) {
        console.error("[AgendaItemsStore] Error saving items:", error);
        this.error = error.message || "Error al guardar puntos de agenda";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Selecciona/deselecciona un punto de agenda
     */
    toggleItem(itemId: string) {
      // TODO: Implementar según estructura del DTO
      console.log(`[AgendaItemsStore] Toggle item: ${itemId}`);
    },

    /**
     * Selecciona un punto de agenda
     */
    selectItem(itemId: string) {
      // TODO: Implementar según estructura del DTO
      console.log(`[AgendaItemsStore] Select item: ${itemId}`);
    },

    /**
     * Deselecciona un punto de agenda
     */
    deselectItem(itemId: string) {
      // TODO: Implementar según estructura del DTO
      console.log(`[AgendaItemsStore] Deselect item: ${itemId}`);
    },

    /**
     * Selecciona todos los puntos
     */
    selectAll() {
      // TODO: Implementar según estructura del DTO
      console.log(`[AgendaItemsStore] Select all`);
    },

    /**
     * Deselecciona todos los puntos
     */
    deselectAll() {
      // TODO: Implementar según estructura del DTO
      console.log(`[AgendaItemsStore] Deselect all`);
    },

    /**
     * Limpia el estado
     */
    clear() {
      this.items = null;
      this.loading = false;
      this.error = null;
      this.societyId = null;
      this.flowId = null;
    },
  },
});

