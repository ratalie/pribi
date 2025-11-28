/**
 * Composable para gestionar la navegación del header de Juntas
 *
 * Gestiona:
 * - Navegación hacia atrás (goBackStep)
 * - Computed para el paso actual
 */

import type { NavigationStep } from "~/types/navigationSteps";

/**
 * Composable para gestionar la navegación del header
 * @param steps - Ref con los pasos de navegación
 * @param currentStepIndex - Ref con el índice del paso actual
 * @param onBack - Callback opcional cuando se hace click en "Salir"
 * @returns Función de navegación y paso actual
 */
export function useJuntasHeaderNavigation(
  steps: Ref<NavigationStep[]>,
  currentStepIndex: Ref<number>,
  onBack?: () => void
) {
  const router = useRouter();

  /**
   * Navega al paso anterior o llama al callback onBack
   */
  const goBackStep = () => {
    if (currentStepIndex.value > 0) {
      const prevStep = steps.value[currentStepIndex.value - 1];
      if (prevStep) {
        router.push(prevStep.route);
      }
    } else {
      onBack?.();
    }
  };

  /**
   * Paso actual (computed)
   */
  const currentStep = computed(() => {
    return steps.value[currentStepIndex.value];
  });

  return {
    goBackStep,
    currentStep,
  };
}

