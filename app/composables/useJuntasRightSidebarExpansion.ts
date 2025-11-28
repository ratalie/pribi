/**
 * Composable para gestionar la expansión/colapso de secciones en el sidebar derecho de Juntas
 *
 * Gestiona:
 * - Estado de secciones expandidas (expandedSections)
 * - Función para toggle de secciones
 * - Función para verificar si una sección está expandida
 * - Watcher para auto-expandir secciones que tienen sub-secciones activas
 */

import type { SectionItem } from "~/types/junta-navigation.types";
import { isSectionActive } from "~/utils/juntas/right-sidebar.utils";

/**
 * Composable para gestionar la expansión del sidebar derecho
 * @param sections - Ref con las secciones del sidebar
 * @param currentSectionId - Ref con el ID de la sección actual
 * @returns Estado y funciones para gestionar la expansión
 */
export function useJuntasRightSidebarExpansion(
  sections: Ref<SectionItem[]>,
  currentSectionId: Ref<string>
) {
  // Estado para controlar qué secciones están expandidas
  const expandedSections = ref<string[]>([]);

  /**
   * Auto-expandir secciones que tienen sub-secciones activas
   */
  const autoExpandActiveSections = () => {
    sections.value.forEach((section) => {
      if (section.subSections) {
        const hasActiveSubSection = section.subSections.some(
          (sub) => sub.id === currentSectionId.value
        );
        if (hasActiveSubSection && !expandedSections.value.includes(section.id)) {
          expandedSections.value.push(section.id);
        }
      }
    });
  };

  /**
   * Toggle expansión de sección
   * @param sectionId - ID de la sección a toggle
   */
  const toggleSection = (sectionId: string) => {
    if (expandedSections.value.includes(sectionId)) {
      expandedSections.value = expandedSections.value.filter((id) => id !== sectionId);
    } else {
      expandedSections.value.push(sectionId);
    }
  };

  /**
   * Verifica si una sección está expandida
   * Una sección está expandida si:
   * - Está en el array expandedSections, O
   * - Está activa (tiene sub-secciones activas)
   * @param section - Sección a verificar
   * @returns true si la sección está expandida
   */
  const isSectionExpanded = (section: SectionItem): boolean => {
    return (
      expandedSections.value.includes(section.id) ||
      isSectionActive(section, currentSectionId.value)
    );
  };

  // Watch para auto-expandir secciones activas cuando cambia currentSectionId
  watch(
    () => currentSectionId.value,
    () => {
      autoExpandActiveSections();
    },
    { immediate: true }
  );

  return {
    expandedSections,
    toggleSection,
    isSectionExpanded,
  };
}

