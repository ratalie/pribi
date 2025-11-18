<script setup lang="ts">
import type { NavigationStep } from "~/types/navigationSteps";
import StatusIcon from "../StatusIcon.vue";
import StepItemBase, { type StepVariant } from "./StepItemBase.vue";

const props = withDefaults(
  defineProps<{
    step: NavigationStep;
    index: number;
    totalSteps: number;
    variant?: StepVariant;
    nextSameLevelIndex?: number | null;
  }>(),
  {
    variant: "default" as StepVariant,
    nextSameLevelIndex: null,
  }
);
</script>

<template>
  <StepItemBase v-bind="props" v-slot="slotProps">
    <div class="flex flex-col gap-2 pl-10">
      <div class="flex items-start gap-3">
        <StatusIcon
          :status="slotProps.step.status"
          :is-final-item="slotProps.isFinalItem"
          :show-line="false"
          :level="slotProps.level"
        />

        <NuxtLink
          :to="slotProps.stepLink"
          class="group flex flex-1 flex-col gap-1 text-left"
        >
          <p class="text-sm font-medium text-[var(--sidebar-text-secondary)] group-hover:text-[var(--sidebar-primary)] group-hover:underline">
            {{ slotProps.step.title }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </StepItemBase>
</template>
