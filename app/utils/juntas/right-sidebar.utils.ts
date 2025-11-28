/**
 * Utilidades para el sidebar derecho de Juntas de Accionistas
 *
 * Este archivo contiene funciones puras (sin dependencias de Vue)
 * para buscar secciones, verificar estados y normalizar estados.
 */

import type { SectionItem } from "~/types/junta-navigation.types";

/**
 * Función recursiva para encontrar el índice de una sección (incluyendo sub-secciones)
 * @param sectionId - ID de la sección a buscar
 * @param sections - Array de secciones donde buscar
 * @param parentIndex - Índice base del padre (para recursión)
 * @returns Índice de la sección o -1 si no se encuentra
 */
export function findSectionIndex(
  sectionId: string,
  sections: SectionItem[],
  parentIndex = 0
): number {
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section) continue;
    if (section.id === sectionId) {
      return parentIndex + i;
    }
    if (section.subSections) {
      const subIndex = findSectionIndex(sectionId, section.subSections, parentIndex + i);
      if (subIndex !== -1) {
        return subIndex;
      }
    }
  }
  return -1;
}

/**
 * Verifica si una sección o sus sub-secciones están activas
 * @param section - Sección a verificar
 * @param currentSectionId - ID de la sección actual
 * @returns true si la sección o alguna de sus sub-secciones está activa
 */
export function isSectionActive(section: SectionItem, currentSectionId: string): boolean {
  if (section.id === currentSectionId) return true;
  if (section.subSections) {
    return section.subSections.some((sub) => sub.id === currentSectionId);
  }
  return false;
}

/**
 * Verifica si una sub-sección está activa
 * @param subSection - Sub-sección a verificar
 * @param currentSectionId - ID de la sección actual
 * @returns true si la sub-sección está activa
 */
export function isSubSectionActive(subSection: SectionItem, currentSectionId: string): boolean {
  return subSection.id === currentSectionId;
}

/**
 * Normaliza el estado de una sección para el componente CheckIcon
 * @param section - Sección a normalizar
 * @param currentSectionId - ID de la sección actual
 * @param sections - Array completo de secciones (para calcular índices)
 * @returns Estado normalizado: "completed" | "current" | "empty"
 */
export function getSectionStatus(
  section: SectionItem,
  currentSectionId: string,
  sections: SectionItem[]
): "completed" | "current" | "empty" {
  // Si tiene status explícito, usarlo
  if (section.status === "completed" || section.status === "current") {
    return section.status;
  }

  // Si es la sección actual, es "current"
  if (section.id === currentSectionId) {
    return "current";
  }

  // Si tiene sub-secciones, verificar si alguna está activa
  if (section.subSections) {
    const hasActiveSubSection = section.subSections.some((sub) => sub.id === currentSectionId);
    if (hasActiveSubSection) {
      return "current";
    }
  }

  // Determinar si es completed basado en el índice
  const currentIndex = findSectionIndex(currentSectionId, sections);
  const sectionIndex = findSectionIndex(section.id, sections);
  if (sectionIndex < currentIndex && sectionIndex !== -1 && currentIndex !== -1) {
    return "completed";
  }

  return "empty";
}

