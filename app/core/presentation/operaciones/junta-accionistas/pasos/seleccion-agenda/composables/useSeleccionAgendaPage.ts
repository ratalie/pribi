/**
 * Composable principal para la página de selección de agenda
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
import { useJuntasRouteParams } from "./useJuntasRouteParams";
import { useSeleccionAgendaController } from "./useSeleccionAgendaController";
import { useSeleccionAgendaInitialization } from "./useSeleccionAgendaInitialization";
import { useSeleccionAgendaSetup } from "./useSeleccionAgendaSetup";

export function useSeleccionAgendaPage() {
  // Obtener IDs de la ruta
  const { societyId, flowId } = useJuntasRouteParams();

  // Controller para el botón "Siguiente"
  const { handleNext } = useSeleccionAgendaController();

  // Inicialización de la vista
  const { initialize } = useSeleccionAgendaInitialization();

  // Obtener composable de junta obligatoria para enviar esAnualObligatoria
  const { juntaObligatoria } = useSeleccionAgendaSetup();

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await handleNext(societyId.value, flowId.value, juntaObligatoria.isJuntaObligatoria.value);
  });

  // Inicializar vista al montar
  onMounted(async () => {
    await initialize();
  });
}
