/**
 * Utilidades para el footer del flujo de Juntas de Accionistas
 *
 * Este archivo contiene funciones puras (sin dependencias de Vue)
 * para calcular títulos, labels de botones y contadores.
 */

import type { NavigationStep, NavigationSubStep } from "~/types/navigationSteps";
import type { SectionItem } from "~/types/junta-navigation.types";

/**
 * Obtiene el título del paso o sub-step actual
 * @param steps - Array de pasos
 * @param currentStepIndex - Índice del paso actual
 * @param currentSubStepId - ID del sub-step actual (opcional)
 * @returns Título del paso o sub-step actual
 */
export function getCurrentStepTitle(
  steps: NavigationStep[],
  currentStepIndex: number,
  currentSubStepId?: string
): string {
  if (currentSubStepId) {
    const step = steps.find((s) => s.subSteps?.some((ss) => ss.id === currentSubStepId));
    const subStep = step?.subSteps?.find((ss) => ss.id === currentSubStepId);
    return subStep?.title || "Punto de Acuerdo";
  }
  return (
    (currentStepIndex >= 0 && steps?.[currentStepIndex]?.title) || "Paso Actual"
  );
}

/**
 * Obtiene el título de la sección actual
 * @param detectedCurrentSection - ID de la sección actual detectada
 * @param sectionsWithCurrent - Array de secciones
 * @returns Título de la sección actual o string vacío
 */
export function getCurrentSectionTitle(
  detectedCurrentSection?: string,
  sectionsWithCurrent?: SectionItem[]
): string {
  if (!detectedCurrentSection || !sectionsWithCurrent?.length) {
    return "";
  }
  return (
    sectionsWithCurrent.find((s) => s.id === detectedCurrentSection)?.title ||
    detectedCurrentSection
  );
}

/**
 * Obtiene el label del botón "Anterior"
 * @param currentSubStepId - ID del sub-step actual (opcional)
 * @param currentStepIndex - Índice del paso actual
 * @returns Label del botón anterior
 */
export function getPrevButtonLabel(
  currentSubStepId?: string,
  currentStepIndex?: number
): string {
  if (currentSubStepId) {
    return "Anterior Sección";
  }
  if (currentStepIndex === 0) {
    return "Anterior";
  }
  return "Anterior Paso";
}

/**
 * Obtiene el label del botón "Siguiente"
 * @param steps - Array de pasos
 * @param currentStepIndex - Índice del paso actual
 * @param currentSubStepId - ID del sub-step actual (opcional)
 * @returns Label del botón siguiente
 */
export function getNextButtonLabel(
  steps: NavigationStep[],
  currentStepIndex: number,
  currentSubStepId?: string
): string {
  const isLastStep =
    currentStepIndex >= 0 &&
    steps?.length &&
    currentStepIndex === steps.length - 1;

  if (isLastStep) {
    return "Finalizar";
  }
  if (currentSubStepId) {
    return "Siguiente Sección";
  }
  if (
    currentStepIndex >= 0 &&
    steps?.[currentStepIndex + 1]?.title === "Puntos de Acuerdo"
  ) {
    return "Siguiente: Puntos de Acuerdo";
  }
  return "Siguiente Paso";
}

/**
 * Obtiene el icono del botón "Siguiente"
 * @param steps - Array de pasos
 * @param currentStepIndex - Índice del paso actual
 * @returns Nombre del icono: "Check" o "ArrowRight"
 */
export function getNextButtonIcon(
  steps: NavigationStep[],
  currentStepIndex: number
): "Check" | "ArrowRight" {
  const isLastStep =
    currentStepIndex >= 0 &&
    steps?.length &&
    currentStepIndex === steps.length - 1;
  return isLastStep ? "Check" : "ArrowRight";
}

/**
 * Obtiene el contador de pasos
 * @param currentStepIndex - Índice del paso actual
 * @param stepsLength - Cantidad total de pasos
 * @returns String con el contador (ej: "Paso 1 de 5")
 */
export function getStepCounter(currentStepIndex: number, stepsLength: number): string {
  if (currentStepIndex >= 0 && stepsLength > 0) {
    return `Paso ${currentStepIndex + 1} de ${stepsLength}`;
  }
  return "Paso 0 de 0";
}

