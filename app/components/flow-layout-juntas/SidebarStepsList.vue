<script setup lang="ts">
  import { useJuntasSidebarExpansion } from "~/composables/useJuntasSidebarExpansion";
  import { useJuntasSidebarNavigation } from "~/composables/useJuntasSidebarNavigation";
  import type { NavigationStep } from "~/types/navigationSteps";
  import {
    getGroupedSubSteps,
    isStepCurrent,
    normalizeStatus,
  } from "~/utils/juntas/sidebar.utils";
  import CheckIconCircle from "./CheckIconCircle.vue";
  import SidebarStepItem from "./SidebarStepItem.vue";
  import SidebarSubStepCategory from "./SidebarSubStepCategory.vue";

  interface Props {
    steps: NavigationStep[];
    currentStepId: string;
    currentSubStepId?: string;
    onStepClick?: (stepId: string) => void;
    onSubStepClick?: (subStepId: string) => void;
  }

  const props = defineProps<Props>();

  // Usar composables
  const { expandedCategories, toggleStep, toggleCategory, isStepExpanded } =
    useJuntasSidebarExpansion(
      computed(() => props.steps),
      computed(() => props.currentStepId)
    );

  const { handleSubStepClick } = useJuntasSidebarNavigation(props.onSubStepClick);

  // Wrapper para toggleStep que incluye el callback
  const handleToggleStep = (step: NavigationStep) => {
    toggleStep(step, props.onStepClick);
  };
</script>

<template>
  <div class="flex flex-col">
    <div v-for="(step, index) in steps" :key="index" class="flex flex-col mb-4 relative">
      <!-- Contenedor principal con CheckIcon + Contenido -->
      <div class="flex items-start gap-4 relative">
        <!-- CheckIcon Container (separado para fácil estilizado) -->
        <div class="shrink-0 flex flex-col relative w-full">
          <!-- Contenedor con hover que incluye CheckIcon (círculo) + Contenido (ancho limitado) -->
          <div
            class="group flex items-start gap-4 rounded-md hover:bg-gray-50 transition-colors px-2 -mx-2 h-fit pb-2 w-full relative z-0"
          >
            <!-- Círculo del CheckIcon (componente separado y estilizable) -->
            <div class="shrink-0">
              <CheckIconCircle :status="normalizeStatus(step.status)" />
            </div>
            <!-- Step Content (separado para fácil estilizado) -->
            <div class="flex-1">
              <!-- Step Principal -->
              <SidebarStepItem
                :step="step"
                :is-expanded="isStepExpanded(step)"
                :is-current="isStepCurrent(step, currentStepId)"
                :status="normalizeStatus(step.status)"
                :is-final-item="index === steps.length - 1"
                :on-toggle="() => handleToggleStep(step)"
                :on-click="onStepClick"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Línea conectora centrada con el círculo, traspasa el hover con z-index -->
      <!-- Se extiende desde el círculo hasta el siguiente círculo (incluyendo sub-steps y mb-4) -->
      <!-- Cálculo de posición:
           - El hover tiene py-1 (4px arriba)
           - El círculo tiene h-7 (28px)
           - Entonces el círculo termina a: 4px (py-1) + 28px (h-7) = 32px
           - left-[14px] centra la línea con el círculo (w-7 = 28px, centro = 14px)
           - La línea se extiende hasta el final incluyendo mb-4 (16px) para conectar con el siguiente círculo
      -->
      <div
        v-if="index !== steps.length - 1 || isStepExpanded(step)"
        :class="[
          'absolute w-0.5 left-3.5 top-7 z-10 transition-all duration-300 pointer-events-none',
          // Se extiende hasta el final incluyendo mb-4 para conectar con el siguiente círculo
          '-bottom-4',
          {
            'bg-gray-300': normalizeStatus(step.status) === 'empty',
            'bg-primary-800':
              normalizeStatus(step.status) === 'current' ||
              normalizeStatus(step.status) === 'completed',
          },
        ]"
      />

      <!-- Sub-steps (solo si está expandido, fuera del hover, debajo del step) -->
      <div
        v-if="isStepExpanded(step) && step.subSteps && step.subSteps.length > 0"
        class="ml-11 mt-2 space-y-2"
        @click.stop
      >
        <!-- Agrupar por categoría -->
        <SidebarSubStepCategory
          v-for="(subStepsInCategory, category) in getGroupedSubSteps(step.subSteps)"
          :key="category"
          :category="category"
          :sub-steps="subStepsInCategory"
          :is-expanded="expandedCategories.includes(category)"
          :current-sub-step-id="currentSubStepId"
          :on-toggle="() => toggleCategory(category)"
          :on-sub-step-click="handleSubStepClick"
        />
      </div>
    </div>
  </div>
</template>
