/**
 * Composable principal para la página de Designación de Auditores Externos
 *
 * Maneja TODA la lógica de la página:
 * - Obtiene IDs de la ruta
 * - Configura el botón "Siguiente"
 * - Inicializa la vista al montar
 *
 * Este composable encapsula toda la lógica para que
 * el componente de la página solo se encargue del template.
 */

import { onMounted } from "vue";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useJuntasRouteParams } from "~/core/presentation/juntas/composables/useJuntasRouteParams";
import { useAuditoresExternosController } from "./useAuditoresExternosController";
import { useAuditoresExternosInitialization } from "./useAuditoresExternosInitialization";

export function useAuditoresExternosPage() {
  // Obtener IDs de la ruta
  const { societyId, flowIdNumber } = useJuntasRouteParams();

  // Controller para el botón "Siguiente"
  const { handleNext } = useAuditoresExternosController();

  // Inicialización de la vista
  const { initialize } = useAuditoresExternosInitialization();

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await handleNext(societyId.value, flowIdNumber.value);
  });

  // Inicializar vista al montar
  onMounted(async () => {
    await initialize();
  });
}

