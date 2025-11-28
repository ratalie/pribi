<script setup lang="ts">
  import { useJuntasSidebarExpansion } from "~/composables/useJuntasSidebarExpansion";
  import { useJuntasSidebarNavigation } from "~/composables/useJuntasSidebarNavigation";
  import type { NavigationStep } from "~/types/navigationSteps";
  import {
    getGroupedSubSteps,
    isStepCurrent,
    normalizeStatus,
  } from "~/utils/juntas/sidebar.utils";
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
  <div>
    <div v-for="(step, index) in steps" :key="index" class="flex flex-col mb-4 relative">
      <!-- Contenedor principal con CheckIcon + Contenido -->
      <div class="flex items-start gap-4 relative">
        <!-- CheckIconJuntas (específico para juntas) - estructura original con línea -->
        <div class="shrink-0 flex flex-col relative">
          <!-- Contenedor con hover que incluye CheckIcon (círculo) + Contenido (ancho limitado) -->
          <div
            class="group flex items-start gap-4 rounded-md hover:bg-gray-50 transition-colors px-2 -mx-2 h-fit w-fit relative z-0"
          >
            <!-- Círculo del CheckIcon -->
            <div class="shrink-0">
              <div class="flex flex-col justify-center items-center">
                <!-- circulo vacio -->
                <div
                  v-if="normalizeStatus(step.status) === 'empty'"
                  class="w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded-full"
                />
                <!-- circulo con punto -->
                <div
                  v-else-if="normalizeStatus(step.status) === 'current'"
                  class="w-7 h-7 flex items-center justify-center border-2 border-primary-800 rounded-full"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-primary-800" />
                </div>
                <!-- icono check -->
                <div
                  v-else-if="normalizeStatus(step.status) === 'completed'"
                  class="w-7 h-7 flex items-center justify-center border-2 bg-primary-800 border-primary-800 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    class="text-white"
                    width="20"
                    height="20"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <!-- Step Content -->
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
