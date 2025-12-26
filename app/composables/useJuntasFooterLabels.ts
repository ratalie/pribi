/**
 * Composable para gestionar los labels y títulos del footer de Juntas
 *
 * Gestiona:
 * - Título del paso/sub-step actual
 * - Título de la sección actual
 * - Labels de botones (Anterior/Siguiente)
 * - Icono del botón Siguiente
 * - Contador de pasos
 */

import type { NavigationStep } from "~/types/navigationSteps";
import type { SectionItem } from "~/types/junta-navigation.types";
import {
  getCurrentStepTitle,
  getCurrentSectionTitle,
  getPrevButtonLabel,
  getNextButtonLabel,
  getNextButtonIcon,
  getStepCounter,
} from "~/utils/juntas/footer.utils";

/**
 * Composable para gestionar los labels del footer
 * @param steps - Ref con los pasos de navegación
 * @param currentStepIndex - Ref con el índice del paso actual
 * @param currentSubStepId - Ref con el ID del sub-step actual (opcional)
 * @param detectedCurrentSection - Ref con el ID de la sección actual detectada (opcional)
 * @param sectionsWithCurrent - Ref con las secciones actuales
 * @returns Computed properties con todos los labels y títulos
 */
export function useJuntasFooterLabels(
  steps: Ref<NavigationStep[]>,
  currentStepIndex: Ref<number>,
  currentSubStepId?: Ref<string | undefined>,
  detectedCurrentSection?: Ref<string | undefined>,
  sectionsWithCurrent?: Ref<SectionItem[]>
) {
  // Título del paso/sub-step actual
  const currentStepTitle = computed(() =>
    getCurrentStepTitle(
      steps.value,
      currentStepIndex.value,
      currentSubStepId?.value
    )
  );

  // Título de la sección actual
  const currentSectionTitle = computed(() =>
    getCurrentSectionTitle(
      detectedCurrentSection?.value,
      sectionsWithCurrent?.value
    )
  );

  // Label del botón Anterior
  const prevButtonLabel = computed(() =>
    getPrevButtonLabel(currentSubStepId?.value, currentStepIndex.value)
  );

  // Label del botón Siguiente
  const nextButtonLabel = computed(() =>
    getNextButtonLabel(steps.value, currentStepIndex.value, currentSubStepId?.value)
  );

  // Icono del botón Siguiente
  const nextButtonIcon = computed(() =>
    getNextButtonIcon(steps.value, currentStepIndex.value)
  );

  // Contador de pasos
  const stepCounter = computed(() =>
    getStepCounter(currentStepIndex.value, steps.value.length)
  );

  return {
    currentStepTitle,
    currentSectionTitle,
    prevButtonLabel,
    nextButtonLabel,
    nextButtonIcon,
    stepCounter,
  };
}

