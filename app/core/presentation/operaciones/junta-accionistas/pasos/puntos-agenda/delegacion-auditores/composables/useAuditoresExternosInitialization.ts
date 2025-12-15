/**
 * Composable para inicializar y cargar datos de Auditores Externos
 *
 * Responsabilidades:
 * - Cargar datos del backend (si hay societyId y flowId)
 * - Manejar errores de carga
 */

import { useJuntasRouteParams } from "~/core/presentation/juntas/composables/useJuntasRouteParams";
import { useAuditoresExternosController } from "./useAuditoresExternosController";

export function useAuditoresExternosInitialization() {
  // Obtener IDs de la ruta
  const { societyId, flowIdNumber } = useJuntasRouteParams();

  // Controller para cargar datos
  const { cargarDatos } = useAuditoresExternosController();

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
      console.error("[useAuditoresExternosInitialization] Error al cargar datos:", error);
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

