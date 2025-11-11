<script setup lang="ts">
import type { NavigationStep } from "~/types/navigationSteps";
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
    <div class="flex flex-col gap-2 pl-12">
      <NuxtLink
        :to="slotProps.stepLink"
        class="group flex items-center gap-2 text-left"
      >
        <span class="relative pl-5 text-xs font-medium text-[#2e293d]">
          <span class="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-[#676472]/40" />
          {{ slotProps.step.title }}
        </span>
      </NuxtLink>
    </div>
  </StepItemBase>
</template>
