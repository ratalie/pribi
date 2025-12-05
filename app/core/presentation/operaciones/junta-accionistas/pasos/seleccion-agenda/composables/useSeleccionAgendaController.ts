/**
 * Controller: Selección de Agenda
 * 
 * Gestiona el ciclo de vida y orquesta el store.
 */

import { onMounted, onUnmounted, computed } from "vue";
import { useSeleccionAgendaStore } from "../stores/seleccion-agenda.store";

export function useSeleccionAgendaController(juntaId: Ref<string>) {
  const store = useSeleccionAgendaStore();

  /**
   * Cargar datos al montar
   */
  onMounted(async () => {
    if (juntaId.value) {
      await store.loadSeleccion(juntaId.value);
    }
  });

  /**
   * Limpiar al desmontar
   */
  onUnmounted(() => {
    // No reseteamos para mantener selección al navegar
  });

  /**
   * Handler para botón "Siguiente"
   */
  const handleNext = async () => {
    if (!juntaId.value) {
      throw new Error("No hay junta ID");
    }

    await store.saveSeleccion(juntaId.value);
  };

  return {
    // Estado
    puntosSeleccionados: computed(() => store.puntosSeleccionados),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    hasPuntosSeleccionados: computed(() => store.hasPuntosSeleccionados),
    totalPuntosSeleccionados: computed(() => store.totalPuntosSeleccionados),
    
    // Funciones
    togglePunto: store.togglePunto,
    isPuntoSeleccionado: store.isPuntoSeleccionado,
    handleNext,
  };
}


