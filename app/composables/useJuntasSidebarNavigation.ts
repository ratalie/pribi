/**
 * Composable para gestionar la navegación en el sidebar de Juntas
 *
 * Gestiona:
 * - Navegación a sub-steps
 * - Callbacks opcionales cuando se hace click en sub-steps
 */

import type { NavigationSubStep } from "~/types/navigationSteps";

/**
 * Composable para gestionar la navegación del sidebar
 * @param onSubStepClick - Callback opcional cuando se hace click en un sub-step
 * @returns Función para manejar clicks en sub-steps
 */
export function useJuntasSidebarNavigation(onSubStepClick?: (subStepId: string) => void) {
  const router = useRouter();

  /**
   * Maneja el click en un sub-step
   * - Navega a la ruta del sub-step
   * - Llama al callback opcional
   * @param subStep - Sub-step al que se hizo click
   */
  const handleSubStepClick = (subStep: NavigationSubStep) => {
    router.push(subStep.route);
    onSubStepClick?.(subStep.id);
  };

  return {
    handleSubStepClick,
  };
}


