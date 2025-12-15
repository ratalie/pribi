/**
 * Composable para inicializar y cargar datos de Pronunciamiento
 *
 * Responsabilidades:
 * - Cargar datos del backend (si hay societyId y flowId)
 * - Manejar errores de carga
 */

import { useJuntasRouteParams } from "~/core/presentation/juntas/composables/useJuntasRouteParams";
import { usePronunciamientoController } from "./usePronunciamientoController";

export function usePronunciamientoInitialization() {
  // Obtener IDs de la ruta
  const { societyId, flowIdNumber } = useJuntasRouteParams();

  // Controller para cargar datos
  const { cargarDatos } = usePronunciamientoController();

  /**
   * Carga datos del backend y actualiza el estado
   */
  const loadFromBackend = async (): Promise<void> => {
    if (!societyId.value || !flowIdNumber.value) {
      // Si no hay IDs, no hacer nada
      return;
    }

    try {
      // Cargar desde el backend
      await cargarDatos();
    } catch (error) {
      console.error("[usePronunciamientoInitialization] Error al cargar datos:", error);
      // No lanzar error, solo loguear (el usuario puede seguir trabajando)
    }
  };

  /**
   * Inicializa completamente la vista
   * Se ejecuta al montar el componente
   */
  const initialize = async (): Promise<void> => {
    // Cargar desde el backend (si hay IDs)
    await loadFromBackend();
  };

  return {
    initialize,
    loadFromBackend,
  };
}

