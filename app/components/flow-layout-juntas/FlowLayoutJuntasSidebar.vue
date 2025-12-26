<script setup lang="ts">
  import { computed } from "vue";
  import { useJuntasLayoutHandlers } from "~/composables/useJuntasLayoutHandlers";
  import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";
  import SingleWizardSidebarJuntas from "./SingleWizardSidebarJuntas.vue";

  /**
   * Componente wrapper para el sidebar izquierdo del flujo de Juntas
   *
   * Este componente encapsula toda la lógica necesaria para el sidebar:
   * - Obtiene los pasos y estado actual desde composables
   * - Gestiona los handlers de eventos
   * - Pasa todos los props necesarios al componente SingleWizardSidebarJuntas
   *
   * No recibe props externos, todo se gestiona internamente.
   */

  // Obtener datos de navegación
  const { steps, currentStepIndex, currentStepSlug, currentSubStepId } =
    useJuntasNavbarRoutes();

  // Obtener handlers (necesitamos pasar algunos valores, pero los obtenemos aquí)
  const { handleStepClick, handleSubStepClick } = useJuntasLayoutHandlers(
    steps,
    currentStepIndex,
    currentSubStepId,
    ref(""), // detectedCurrentSection - no se usa en sidebar
    ref([]), // finalSections - no se usa en sidebar
    () => {} // handleSectionClick - no se usa en sidebar
  );

  // Calcular progreso
  const progress = computed(() => ({
    current: currentStepIndex.value + 1,
    total: steps.value.length,
  }));
</script>

<template>
  <SingleWizardSidebarJuntas
    :steps="steps"
    :current-step-id="currentStepSlug"
    :current-sub-step-id="currentSubStepId"
    :on-step-click="handleStepClick"
    :on-sub-step-click="handleSubStepClick"
    title="Junta de Accionistas"
    :progress="progress"
    icon="Users"
  />
</template>
