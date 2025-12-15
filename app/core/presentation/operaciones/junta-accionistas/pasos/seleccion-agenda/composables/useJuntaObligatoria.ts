/**
 * Composable para gestionar la lógica de Junta Obligatoria Anual
 * 
 * Responsabilidades:
 * - Gestionar estado del toggle de junta obligatoria
 * - Agregar/remover puntos obligatorios automáticamente
 * - Validar que junta obligatoria tenga puntos requeridos
 */

import type { usePuntosAgenda } from "./usePuntosAgenda";
import { PUNTOS_JUNTA_OBLIGATORIA } from "../types/puntos-agenda.types";

type PuntosAgendaReturn = ReturnType<typeof usePuntosAgenda>;

export function useJuntaObligatoria(puntosAgenda: PuntosAgendaReturn) {
  const isJuntaObligatoria = ref(false);

  /**
   * Toggle de junta obligatoria
   */
  const toggleJuntaObligatoria = () => {
    const newValue = !isJuntaObligatoria.value;
    isJuntaObligatoria.value = newValue;

    if (newValue) {
      // Agregar puntos obligatorios si no están
      PUNTOS_JUNTA_OBLIGATORIA.forEach((id) => {
        puntosAgenda.addPunto(id);
      });
    } else {
      // Remover puntos obligatorios
      PUNTOS_JUNTA_OBLIGATORIA.forEach((id) => {
        puntosAgenda.removePunto(id);
      });
    }
  };

  /**
   * Verificar si todos los puntos obligatorios están seleccionados
   */
  const hasAllObligatoryPuntos = computed(() => {
    return PUNTOS_JUNTA_OBLIGATORIA.every((id) =>
      puntosAgenda.isPuntoSelected(id)
    );
  });

  /**
   * Sincronizar estado de junta obligatoria basado en puntos seleccionados
   */
  const syncFromPuntos = () => {
    isJuntaObligatoria.value = hasAllObligatoryPuntos.value;
  };

  /**
   * Inicializar estado desde puntos seleccionados
   */
  const initializeFromPuntos = () => {
    syncFromPuntos();
  };

  return {
    // Estado
    isJuntaObligatoria: readonly(isJuntaObligatoria),
    hasAllObligatoryPuntos,

    // Métodos
    toggleJuntaObligatoria,
    syncFromPuntos,
    initializeFromPuntos,
  };
}

