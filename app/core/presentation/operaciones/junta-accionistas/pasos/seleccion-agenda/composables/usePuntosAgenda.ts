/**
 * Composable para gestionar la lógica de puntos de agenda
 *
 * Responsabilidades:
 * - Gestionar lista de puntos disponibles
 * - Manejar selección/deselección de puntos
 * - Validar selección mínima
 * - Sincronizar con stores
 */

import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import type { PuntoAgenda } from "../types/puntos-agenda.types";
import { PUNTOS_AGENDA } from "../types/puntos-agenda.types";

export function usePuntosAgenda() {
  const juntasFlowStore = useJuntasFlowStore();

  // Estado local de puntos seleccionados
  const selectedPuntos = ref<string[]>([]);

  /**
   * Inicializar con datos del store
   */
  const initializeFromStore = () => {
    selectedPuntos.value = [...juntasFlowStore.getDynamicSubSteps];
  };

  /**
   * Inicializar con datos externos (del backend)
   */
  const initializeFromExternal = (puntos: string[]) => {
    selectedPuntos.value = [...puntos];
    juntasFlowStore.updateDynamicSubSteps([...puntos]);
  };

  /**
   * Toggle de un punto (seleccionar/deseleccionar)
   */
  const togglePunto = (puntoId: string) => {
    const index = selectedPuntos.value.indexOf(puntoId);
    if (index > -1) {
      // Ya está seleccionado, remover
      selectedPuntos.value.splice(index, 1);
    } else {
      // No está seleccionado, agregar
      selectedPuntos.value.push(puntoId);
    }

    // Sincronizar con store
    juntasFlowStore.updateDynamicSubSteps([...selectedPuntos.value]);
  };

  /**
   * Agregar punto si no está seleccionado
   */
  const addPunto = (puntoId: string) => {
    console.log(`🟢 [usePuntosAgenda] addPunto:`, { puntoId, current: selectedPuntos.value });
    if (!selectedPuntos.value.includes(puntoId)) {
      selectedPuntos.value.push(puntoId);
      console.log(`🟢 [usePuntosAgenda] Después de agregar:`, selectedPuntos.value);
      juntasFlowStore.updateDynamicSubSteps([...selectedPuntos.value]);
    } else {
      console.log(`🟡 [usePuntosAgenda] Punto ya estaba seleccionado:`, puntoId);
    }
  };

  /**
   * Remover punto si está seleccionado
   */
  const removePunto = (puntoId: string) => {
    console.log(`🔴 [usePuntosAgenda] removePunto:`, {
      puntoId,
      current: selectedPuntos.value,
    });
    selectedPuntos.value = selectedPuntos.value.filter((id) => id !== puntoId);
    console.log(`🔴 [usePuntosAgenda] Después de remover:`, selectedPuntos.value);
    juntasFlowStore.updateDynamicSubSteps([...selectedPuntos.value]);
  };

  /**
   * Verificar si un punto está seleccionado
   */
  const isPuntoSelected = (puntoId: string): boolean => {
    return selectedPuntos.value.includes(puntoId);
  };

  /**
   * Validar que haya al menos un punto seleccionado
   */
  const hasMinSelection = computed(() => {
    return selectedPuntos.value.length > 0;
  });

  /**
   * Obtener todos los puntos disponibles
   */
  const allPuntos = computed(() => PUNTOS_AGENDA);

  /**
   * Obtener puntos seleccionados
   */
  const selectedPuntosList = computed(() => {
    return PUNTOS_AGENDA.filter((punto) => selectedPuntos.value.includes(punto.id));
  });

  return {
    // Estado - NO usar readonly aquí para mantener reactividad
    selectedPuntos,
    allPuntos,
    selectedPuntosList,
    hasMinSelection,

    // Métodos
    initializeFromStore,
    initializeFromExternal,
    togglePunto,
    addPunto,
    removePunto,
    isPuntoSelected,
  };
}

