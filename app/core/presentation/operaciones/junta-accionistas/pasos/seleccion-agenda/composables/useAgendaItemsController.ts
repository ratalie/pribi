/**
 * Controller para Selección de Puntos de Agenda
 * 
 * Gestiona el ciclo de vida del componente de selección de agenda.
 * 
 * @architecture Controller Pattern
 * @layer Presentation
 */

import { onMounted, onActivated } from "vue";
import { storeToRefs } from "pinia";
import { useAgendaItemsStore } from "../stores/agenda-items.store";

/**
 * Opciones para el controller
 */
export interface UseAgendaItemsControllerOptions {
  /**
   * Cargar automáticamente al montar el componente
   * @default true
   */
  autoLoad?: boolean;

  /**
   * Recargar al activar el componente (keep-alive)
   * @default false
   */
  reloadOnActivated?: boolean;
}

/**
 * Controller para Selección de Puntos de Agenda
 */
export function useAgendaItemsController(
  societyId: number | string,
  flowId: string,
  options: UseAgendaItemsControllerOptions = {}
) {
  const { autoLoad = true, reloadOnActivated = false } = options;

  // ========================================
  // STORE
  // ========================================
  const store = useAgendaItemsStore();
  const {
    items,
    loading,
    error,
    selectedItems,
    selectedItemIds,
    selectedCount,
    hasSelectedItems,
    isReadyToContinue,
  } = storeToRefs(store);

  // ========================================
  // METHODS
  // ========================================
  
  /**
   * Carga los puntos de agenda
   */
  async function loadItems() {
    const sid = typeof societyId === "string" ? parseInt(societyId, 10) : societyId;
    
    if (!sid || isNaN(sid)) {
      console.error("[AgendaItemsController] Invalid societyId:", societyId);
      return;
    }

    await store.load(sid, flowId);
  }

  /**
   * Guarda los puntos seleccionados
   */
  async function saveItems() {
    await store.save();
  }

  /**
   * Selecciona/deselecciona un punto
   */
  function toggleItem(itemId: string) {
    store.toggleItem(itemId);
  }

  /**
   * Selecciona un punto
   */
  function selectItem(itemId: string) {
    store.selectItem(itemId);
  }

  /**
   * Deselecciona un punto
   */
  function deselectItem(itemId: string) {
    store.deselectItem(itemId);
  }

  /**
   * Selecciona todos
   */
  function selectAll() {
    store.selectAll();
  }

  /**
   * Deselecciona todos
   */
  function deselectAll() {
    store.deselectAll();
  }

  // ========================================
  // LIFECYCLE
  // ========================================
  
  if (autoLoad) {
    onMounted(async () => {
      console.log("[AgendaItemsController] onMounted - Loading items...");
      await loadItems();
    });
  }

  if (reloadOnActivated) {
    onActivated(async () => {
      console.log("[AgendaItemsController] onActivated - Reloading items...");
      await loadItems();
    });
  }

  // ========================================
  // RETURN
  // ========================================
  
  return {
    // State
    items,
    loading,
    error,
    selectedItems,
    selectedItemIds,
    selectedCount,
    hasSelectedItems,
    isReadyToContinue,

    // Methods
    loadItems,
    saveItems,
    toggleItem,
    selectItem,
    deselectItem,
    selectAll,
    deselectAll,
  };
}

