/**
 * Utilidades para el sidebar de Juntas de Accionistas
 *
 * Este archivo contiene funciones puras (sin dependencias de Vue)
 * para normalizar estados, agrupar datos y validar condiciones.
 */

import type { NavigationStep, NavigationSubStep } from "~/types/navigationSteps";

/**
 * Extrae el slug del paso desde una ruta
 * @param route - Ruta completa (ej: "/operaciones/junta-accionistas/puntos-acuerdo")
 * @returns Slug del paso (ej: "puntos-acuerdo")
 */
export function extractStepSlug(route: string): string {
  return route.split("/").pop() || "";
}

/**
 * Normaliza el estado de un paso para el componente CheckIcon
 * @param status - Estado del paso (puede ser undefined, "completed", "current", etc.)
 * @returns Estado normalizado: "completed" | "current" | "empty"
 */
export function normalizeStatus(
  status: NavigationStep["status"]
): "completed" | "current" | "empty" {
  if (status === "completed" || status === "current") {
    return status;
  }
  return "empty";
}

/**
 * Normaliza el estado de un sub-step para el componente CheckIcon
 * @param subStep - Sub-step a normalizar
 * @param currentSubStepId - ID del sub-step actual (opcional)
 * @returns Estado normalizado: "completed" | "current" | "empty"
 */
export function normalizeSubStepStatus(
  subStep: NavigationSubStep,
  currentSubStepId?: string
): "completed" | "current" | "empty" {
  if (subStep.status === "completed" || subStep.status === "current") {
    return subStep.status;
  }
  if (subStep.id === currentSubStepId) {
    return "current";
  }
  return "empty";
}

/**
 * Agrupa sub-steps por categoría
 * @param subSteps - Array de sub-steps a agrupar
 * @returns Objeto con categorías como keys y arrays de sub-steps como values
 */
export function getGroupedSubSteps(
  subSteps: NavigationSubStep[]
): Record<string, NavigationSubStep[]> {
  const categories: Record<string, NavigationSubStep[]> = {};

  subSteps.forEach((subStep) => {
    const category = subStep.category || "General";
    if (!categories[category]) {
      categories[category] = [];
    }
    const categoryArray = categories[category];
    if (categoryArray) {
      categoryArray.push(subStep);
    }
  });

  return categories;
}

/**
 * Determina si un paso es el paso actual
 * @param step - Paso a verificar
 * @param currentStepId - ID del paso actual
 * @returns true si el paso es el actual, false en caso contrario
 */
export function isStepCurrent(step: NavigationStep, currentStepId: string): boolean {
  const stepSlug = extractStepSlug(step.route);
  // Solo comparación exacta del slug para evitar activar múltiples steps
  return stepSlug === currentStepId;
}


