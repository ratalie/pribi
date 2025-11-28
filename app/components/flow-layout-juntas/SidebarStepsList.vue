<script setup lang="ts">
  import { useJuntasSidebarExpansion } from "~/composables/useJuntasSidebarExpansion";
  import { useJuntasSidebarNavigation } from "~/composables/useJuntasSidebarNavigation";
  import type { NavigationStep } from "~/types/navigationSteps";
  import {
    getGroupedSubSteps,
    isStepCurrent,
    normalizeStatus,
  } from "~/utils/juntas/sidebar.utils";
  import CheckIcon from "../flow-layout/CheckIcon.vue";
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
    <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-4">
      <!-- CheckIcon (estilo registros) -->
      <CheckIcon
        :status="normalizeStatus(step.status)"
        :is-final-item="index === steps.length - 1 && !isStepExpanded(step)"
      />

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

        <!-- Sub-steps (solo si está expandido) -->
        <div
          v-if="isStepExpanded(step) && step.subSteps && step.subSteps.length > 0"
          class="ml-8 mt-2 space-y-2"
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
  </div>
</template>

