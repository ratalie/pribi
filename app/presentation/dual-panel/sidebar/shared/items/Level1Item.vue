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
    <div class="flex flex-col gap-3">
      <div class="flex items-start gap-4">
        <StatusIcon
          :status="slotProps.step.status"
          :is-final-item="slotProps.isFinalItem"
          :show-line="slotProps.level <= 1 && !slotProps.isFinalItem"
          :level="slotProps.level"
          :connector-gap="24"
        />

        <NuxtLink
          :to="slotProps.stepLink"
          class="group flex flex-1 flex-col gap-1 text-left"
        >
          <p class="text-sm font-semibold text-[var(--sidebar-text-primary)] group-hover:text-[var(--sidebar-primary)] group-hover:underline">
            {{ slotProps.step.title }}
          </p>
          <span
            v-if="slotProps.showDescription"
            class="text-xs font-normal text-[#676472] group-hover:underline"
          >
            {{ slotProps.step.description }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </StepItemBase>
</template>
