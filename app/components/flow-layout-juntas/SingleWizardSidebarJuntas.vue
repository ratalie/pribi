<script setup lang="ts">
  import type { NavigationStep } from "~/types/navigationSteps";
  import { useJuntasResponsive } from "~/composables/useJuntasResponsive";
  import ProgressBarJuntas from "./ProgressBarJuntas.vue";
  import SidebarHeader from "./SidebarHeader.vue";
  import SidebarStepsList from "./SidebarStepsList.vue";

  interface Props {
    steps: NavigationStep[];
    currentStepId: string;
    currentSubStepId?: string;
    onStepClick?: (stepId: string) => void;
    onSubStepClick?: (subStepId: string) => void;
    title: string;
    icon?: string;
    progress: { current: number; total: number };
  }

  defineProps<Props>(); // Props usado en template
  
  // Detectar si estamos en mobile para ajustar el width
  const { isMobileLayout } = useJuntasResponsive();
</script>

<template>
  <div
    :class="[
      'shrink-0 border-r bg-white overflow-y-auto h-full transition-all duration-300',
      isMobileLayout ? 'w-[280px]' : 'w-[401px]',
    ]"
  >
    <div :class="[isMobileLayout ? 'px-4 py-6' : 'px-6 py-10']">
      <!-- Header con ícono y título -->
      <SidebarHeader
        :title="title"
        :progress="progress"
        :icon="icon"
        :steps="steps"
        :current-step-id="currentStepId"
        :current-sub-step-id="currentSubStepId"
      />

      <!-- Progress Bar -->
      <ProgressBarJuntas :current="progress.current" :total="progress.total" />

      <!-- Steps List -->
      <SidebarStepsList
        :steps="steps"
        :current-step-id="currentStepId"
        :current-sub-step-id="currentSubStepId"
        :on-step-click="onStepClick"
        :on-sub-step-click="onSubStepClick"
      />
    </div>
  </div>
</template>
