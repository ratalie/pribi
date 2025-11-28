/**
 * Composable para gestionar secciones del sidebar derecho
 */

import { computed } from "vue";
import { getBaseSectionsForSubStep, applySectionStatuses } from "~/config/juntas/sections.config";
import type { SectionItem } from "~/types/junta-navigation.types";

/**
 * Gestiona las secciones del sidebar derecho para el flujo normal (sub-steps)
 */
export function useJuntasSections(
  isResumenPage: { value: boolean },
  currentSubStepId: { value: string | undefined },
  detectedCurrentSection: { value: string }
) {
  const sections = computed(() => {
    // Si estamos en resumen, retornar array vacío (se usará resumenSections)
    if (isResumenPage.value) {
      return [];
    }

    if (!currentSubStepId.value) {
      return [];
    }

    const baseSections = getBaseSectionsForSubStep(currentSubStepId.value);
    const result = applySectionStatuses(baseSections, detectedCurrentSection.value);

    console.log("🟦 [useJuntasSections] sections computed (normal):", {
      currentSubStepId: currentSubStepId.value,
      detectedCurrentSection: detectedCurrentSection.value,
      sectionsCount: result.length,
      sections: result.map((s) => ({ id: s.id, title: s.title })),
    });

    return result;
  });

  return {
    sections,
  };
}

