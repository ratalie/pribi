<script setup lang="ts">
  import { useJuntasLayoutHandlers } from "~/composables/useJuntasLayoutHandlers";
  import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";
  import HeaderJuntasNavbar from "./HeaderJuntasNavbar.vue";

  /**
   * Componente wrapper para el header del flujo de Juntas
   *
   * Este componente encapsula toda la lógica necesaria para el header:
   * - Obtiene los pasos y estado actual desde composables
   * - Gestiona los handlers de eventos (back, save, reset)
   * - Pasa todos los props necesarios al componente HeaderJuntasNavbar
   *
   * No recibe props externos, todo se gestiona internamente.
   */

  // Obtener datos de navegación
  const { steps, currentStepIndex } = useJuntasNavbarRoutes();

  // Obtener handlers (necesitamos pasar algunos valores, pero los obtenemos aquí)
  const { handleBack, handleSave, handleReset } = useJuntasLayoutHandlers(
    steps,
    currentStepIndex,
    ref(undefined), // currentSubStepId - no se usa en header
    ref(""), // detectedCurrentSection - no se usa en header
    ref([]), // finalSections - no se usa en header
    () => {} // handleSectionClick - no se usa en header
  );
</script>

<template>
  <HeaderJuntasNavbar
    :steps="steps"
    :current-step-index="currentStepIndex"
    :on-back="handleBack"
    :on-save="handleSave"
    :on-reset="handleReset"
  />
</template>
