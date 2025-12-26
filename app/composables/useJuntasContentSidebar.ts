/**
 * Composable para gestionar el sidebar derecho del área de contenido
 *
 * Gestiona:
 * - Determinar si debe mostrarse el sidebar derecho
 * - Calcular el título del sidebar derecho
 * - Determinar las secciones finales a mostrar
 */

import type { NavigationStep } from "~/types/navigationSteps";
import type { SectionItem } from "~/types/junta-navigation.types";

/**
 * Composable para gestionar el sidebar derecho del contenido
 * @param isResumenPage - Ref que indica si estamos en la página de resumen
 * @param currentSubStepId - Ref con el ID del sub-step actual
 * @param steps - Ref con los pasos de navegación
 * @param resumenSections - Ref con las secciones del resumen
 * @param sectionsWithCurrent - Ref con las secciones del flujo normal
 * @returns Computed properties para el sidebar derecho
 */
export function useJuntasContentSidebar(
  isResumenPage: Ref<boolean>,
  currentSubStepId: Ref<string | undefined>,
  steps: Ref<NavigationStep[]>,
  resumenSections: Ref<SectionItem[]>,
  sectionsWithCurrent: Ref<SectionItem[]>
) {
  /**
   * Secciones finales: usar resumenSections si estamos en resumen, sino usar sections normales
   */
  const finalSections = computed(() => {
    if (isResumenPage.value) {
      console.log(
        "🟦 [useJuntasContentSidebar] Usando secciones de resumen:",
        resumenSections.value.length
      );
      return resumenSections.value;
    }
    return sectionsWithCurrent.value;
  });

  /**
   * Determinar si debe mostrarse el sidebar derecho
   */
  const hasRightSidebar = computed(() => {
    if (isResumenPage.value) {
      const hasSections = resumenSections.value && resumenSections.value.length > 0;
      console.log("🟪 [useJuntasContentSidebar] hasRightSidebar (resumen):", {
        isResumenPage: true,
        hasSections,
        sectionsCount: resumenSections.value?.length || 0,
        result: hasSections,
      });
      return hasSections;
    }

    const hasSubStep = !!currentSubStepId.value;
    const hasSections = sectionsWithCurrent.value && sectionsWithCurrent.value.length > 0;
    const result = hasSubStep && hasSections;
    console.log("🟪 [useJuntasContentSidebar] hasRightSidebar (normal):", {
      hasSubStep,
      hasSections,
      currentSubStepId: currentSubStepId.value,
      sectionsCount: sectionsWithCurrent.value?.length || 0,
      result,
    });
    return result;
  });

  /**
   * Título del sidebar derecho
   */
  const rightSidebarTitle = computed(() => {
    if (isResumenPage.value) {
      return "Resumen de la Junta";
    }
    return (
      steps.value.find((s) =>
        s.subSteps?.some((ss) => ss.id === currentSubStepId.value)
      )?.title || "Secciones"
    );
  });

  return {
    finalSections,
    hasRightSidebar,
    rightSidebarTitle,
  };
}

