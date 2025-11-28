<script setup lang="ts">
import FlowLayoutJuntasFooter from "./FlowLayoutJuntasFooter.vue";
import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";
import { useJuntasNavigation } from "~/composables/useJuntasNavigation";
import { useJuntasResumenDetection } from "~/composables/useJuntasResumenDetection";
import { useJuntasSections } from "~/composables/useJuntasSections";
import { useJuntasLayoutHandlers } from "~/composables/useJuntasLayoutHandlers";
import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import { computed } from "vue";

/**
 * Componente wrapper para el footer del flujo de Juntas
 *
 * Este componente encapsula toda la lógica necesaria para el footer:
 * - Obtiene los pasos y estado actual desde composables
 * - Gestiona la navegación y secciones
 * - Gestiona los handlers de eventos (prev, next)
 * - Pasa todos los props necesarios al componente FlowLayoutJuntasFooter
 *
 * No recibe props externos, todo se gestiona internamente.
 */

// Obtener datos de navegación
const { steps, currentStepIndex, currentSubStepId } = useJuntasNavbarRoutes();

const juntasFlowStore = useJuntasFlowStore();

// Detección de resumen general
const { isResumenPage } = useJuntasResumenDetection();

// Navegación (para obtener detectedCurrentSection)
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

// Secciones finales para el handler
const finalSections = computed(() => sectionsWithCurrent.value);

// Obtener handlers
const { handlePrev } = useJuntasLayoutHandlers(
  steps,
  currentStepIndex,
  currentSubStepId,
  detectedCurrentSection,
  finalSections,
  handleSectionClick
);
</script>

<template>
  <FlowLayoutJuntasFooter
    :steps="steps"
    :current-step-index="currentStepIndex"
    :current-sub-step-id="currentSubStepId"
    :detected-current-section="detectedCurrentSection"
    :sections-with-current="sectionsWithCurrent"
    :is-loading="juntasFlowStore.isLoading"
    :on-prev="handlePrev"
    :on-next="juntasFlowStore.onClickNext"
  />
</template>

