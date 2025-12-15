/**
 * Composable principal para la página de instalación
 *
 * Maneja TODA la lógica de la página:
 * - Obtiene IDs de la ruta
 * - Configura el botón "Siguiente"
 * - Inicializa la vista al montar
 *
 * Este composable encapsula toda la lógica para que
 * el componente de la página solo se encargue del template.
 */

import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useInstalacionController } from "./useInstalacionController";
import { useInstalacionInitialization } from "./useInstalacionInitialization";
import { useJuntasRouteParams } from "./useJuntasRouteParams";

export function useInstalacionPage() {
  // Obtener IDs de la ruta
  const { societyId, flowIdNumber } = useJuntasRouteParams();

  // Controller para el botón "Siguiente"
  const { handleNext } = useInstalacionController();

  // Inicialización de la vista
  const { initialize } = useInstalacionInitialization();

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    if (!societyId.value || !flowIdNumber.value) {
      throw new Error("Faltan los IDs de la sociedad o flujo");
    }
    await handleNext(societyId.value, flowIdNumber.value);
  });

  // Inicializar vista al montar
  onMounted(async () => {
    await initialize();
  });
}
