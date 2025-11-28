/**
 * Composable para gestionar la expansión/colapso de pasos y categorías en el sidebar de Juntas
 *
 * Gestiona:
 * - Estado de pasos expandidos (expandedSteps)
 * - Estado de categorías expandidas (expandedCategories)
 * - Lógica para expandir automáticamente el paso actual y "puntos-acuerdo"
 * - Funciones para toggle de pasos y categorías
 * - Watchers para reaccionar a cambios en steps y currentStepId
 */

import type { NavigationStep } from "~/types/navigationSteps";
import { extractStepSlug } from "~/utils/juntas/sidebar.utils";

/**
 * Composable para gestionar la expansión del sidebar
 * @param steps - Ref con los pasos de navegación
 * @param currentStepId - Ref con el ID del paso actual
 * @returns Estado y funciones para gestionar la expansión
 */
export function useJuntasSidebarExpansion(
  steps: Ref<NavigationStep[]>,
  currentStepId: Ref<string>
) {
  // Estado para controlar qué pasos están expandidos
  const expandedSteps = ref<string[]>([]);
  const expandedCategories = ref<string[]>([]);

  /**
   * Actualiza el estado de pasos expandidos basado en los steps actuales
   * - Expande el paso actual si tiene sub-steps
   * - SIEMPRE expande "puntos-acuerdo" si existe (incluso sin sub-steps)
   * - Expande todas las categorías de "puntos-acuerdo" si tiene sub-steps
   */
  const updateExpandedSteps = () => {
    console.log("🔴 [useJuntasSidebarExpansion] updateExpandedSteps ejecutado");
    console.log("🔴 [useJuntasSidebarExpansion] steps:", steps.value);
    console.log("🔴 [useJuntasSidebarExpansion] currentStepId:", currentStepId.value);

    const newSteps = steps.value;

    // Expandir paso actual si tiene sub-steps
    const currentStep = newSteps.find((s) => {
      const stepSlug = extractStepSlug(s.route);
      return stepSlug === currentStepId.value || s.route.includes(currentStepId.value);
    });
    if (currentStep?.subSteps && currentStep.subSteps.length > 0) {
      const stepSlug = extractStepSlug(currentStep.route);
      if (!expandedSteps.value.includes(stepSlug)) {
        expandedSteps.value.push(stepSlug);
        console.log("🔴 [useJuntasSidebarExpansion] Expandido paso actual:", stepSlug);
      }
    }

    // Solo expandir "puntos-acuerdo" si es el paso actual o si ya está expandido manualmente
    const puntosAcuerdoStep = newSteps.find((s) => {
      const stepSlug = extractStepSlug(s.route);
      return stepSlug === "puntos-acuerdo";
    });

    if (puntosAcuerdoStep) {
      const subStepsCount = puntosAcuerdoStep.subSteps?.length || 0;
      const isPuntosAcuerdoCurrent = currentStepId.value === "puntos-acuerdo";
      
      // Solo expandir "puntos-acuerdo" si es el paso actual
      if (isPuntosAcuerdoCurrent && !expandedSteps.value.includes("puntos-acuerdo")) {
        expandedSteps.value.push("puntos-acuerdo");
        console.log("🔴 [useJuntasSidebarExpansion] Expandido 'puntos-acuerdo' (es paso actual)");
        
        // Expandir todas las categorías de "puntos-acuerdo" si tiene sub-steps
        if (subStepsCount > 0) {
          const categories = new Set(puntosAcuerdoStep.subSteps?.map((s) => s.category) || []);
          categories.forEach((category) => {
            if (category && !expandedCategories.value.includes(category)) {
              expandedCategories.value.push(category);
              console.log("🔴 [useJuntasSidebarExpansion] Expandida categoría:", category);
            }
          });
        }
      }
    } else {
      console.log("🔴 [useJuntasSidebarExpansion] Paso 'puntos-acuerdo' NO encontrado en steps");
    }
  };

  /**
   * Toggle de un paso (expandir/colapsar)
   * @param step - Paso a toggle
   * @param onStepClick - Callback opcional cuando se hace click en el paso
   */
  const toggleStep = (step: NavigationStep, onStepClick?: (stepId: string) => void) => {
    const stepSlug = extractStepSlug(step.route);
    if (expandedSteps.value.includes(stepSlug)) {
      expandedSteps.value = expandedSteps.value.filter((id) => id !== stepSlug);
    } else {
      expandedSteps.value.push(stepSlug);
    }
    if (onStepClick) {
      onStepClick(stepSlug);
    }
  };

  /**
   * Toggle de una categoría (expandir/colapsar)
   * @param categoryId - ID de la categoría a toggle
   */
  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.value.includes(categoryId)) {
      expandedCategories.value = expandedCategories.value.filter((id) => id !== categoryId);
    } else {
      expandedCategories.value.push(categoryId);
    }
  };

  /**
   * Determina si un paso está expandido
   * @param step - Paso a verificar
   * @returns true si el paso está expandido, false en caso contrario
   */
  const isStepExpanded = (step: NavigationStep): boolean => {
    const stepSlug = extractStepSlug(step.route);
    return expandedSteps.value.includes(stepSlug);
  };

  // Watch para steps (cambios en el array completo)
  watch(
    () => steps.value,
    (newSteps, oldSteps) => {
      console.log("🔴 [useJuntasSidebarExpansion] Watch steps cambiaron");
      console.log("🔴 [useJuntasSidebarExpansion] Old steps count:", oldSteps?.length || 0);
      console.log("🔴 [useJuntasSidebarExpansion] New steps count:", newSteps.length);

      // Verificar si "puntos-acuerdo" cambió
      const oldPuntosAcuerdo = oldSteps?.find((s) => s.route.includes("puntos-acuerdo"));
      const newPuntosAcuerdo = newSteps.find((s) => s.route.includes("puntos-acuerdo"));

      if (oldPuntosAcuerdo && newPuntosAcuerdo) {
        const oldSubStepsCount = oldPuntosAcuerdo.subSteps?.length || 0;
        const newSubStepsCount = newPuntosAcuerdo.subSteps?.length || 0;
        console.log("🔴 [useJuntasSidebarExpansion] 'puntos-acuerdo' sub-steps:", {
          old: oldSubStepsCount,
          new: newSubStepsCount,
        });
      }

      updateExpandedSteps();
    },
    { immediate: true, deep: true }
  );

  // Watch para currentStepId
  watch(
    () => currentStepId.value,
    () => {
      console.log("🔴 [useJuntasSidebarExpansion] Watch currentStepId cambiaron:", currentStepId.value);
      updateExpandedSteps();
    },
    { immediate: true }
  );

  return {
    expandedSteps,
    expandedCategories,
    updateExpandedSteps,
    toggleStep,
    toggleCategory,
    isStepExpanded,
  };
}


