<script setup lang="ts">
  import type { NavigationStep } from "~/types/navigationSteps";
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
</script>

<template>
  <div class="w-[401px] shrink-0 border-r bg-white overflow-y-auto h-full">
    <div class="px-6 py-10">
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
