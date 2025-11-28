<script setup lang="ts">
import FlowLayoutJuntasContent from "./FlowLayoutJuntasContent.vue";
import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";
import { useJuntasNavigation } from "~/composables/useJuntasNavigation";
import { useJuntasResumenDetection } from "~/composables/useJuntasResumenDetection";
import { useJuntasResumenSections } from "~/composables/useJuntasResumenSections";
import { useJuntasSections } from "~/composables/useJuntasSections";
import { useJuntasContentSidebar } from "~/composables/useJuntasContentSidebar";

/**
 * Componente wrapper para el área de contenido del flujo de Juntas
 *
 * Este componente encapsula toda la lógica necesaria para el contenido:
 * - Obtiene los datos de navegación y secciones
 * - Determina si debe mostrarse el sidebar derecho
 * - Calcula el título del sidebar derecho
 * - Pasa todos los props necesarios al componente FlowLayoutJuntasContent
 *
 * No recibe props externos, todo se gestiona internamente.
 */

// Obtener datos de navegación
const { steps, currentSubStepId } = useJuntasNavbarRoutes();

// Detección de resumen general
const { isResumenPage } = useJuntasResumenDetection();

// Secciones del resumen (solo cuando estamos en /resumen)
const { sections: resumenSections } = useJuntasResumenSections();

// Navegación (debe ir primero para obtener detectedCurrentSection)
const { detectedCurrentSection, handleSectionClick } = useJuntasNavigation(
  isResumenPage,
  currentSubStepId
);

// Secciones para el flujo normal (sub-steps)
const { sections: sectionsWithCurrent } = useJuntasSections(
  isResumenPage,
  currentSubStepId,
  detectedCurrentSection
);

// Usar composable para gestionar el sidebar derecho
const { finalSections, hasRightSidebar, rightSidebarTitle } = useJuntasContentSidebar(
  isResumenPage,
  currentSubStepId,
  steps,
  resumenSections,
  sectionsWithCurrent
);
</script>

<template>
  <FlowLayoutJuntasContent
    :has-right-sidebar="hasRightSidebar"
    :final-sections="finalSections"
    :current-section-id="detectedCurrentSection || finalSections[0]?.id || ''"
    :right-sidebar-title="rightSidebarTitle"
    :on-section-click="handleSectionClick"
  >
    <slot />
  </FlowLayoutJuntasContent>
</template>

