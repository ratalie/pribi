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
    <div
      class="flex flex-col"
      :class="slotProps.variant === 'sections' ? 'gap-3 pl-6' : 'gap-2 pl-11'"
    >
      <div class="flex items-start gap-3" :class="slotProps.variant === 'sections' ? '' : 'pl-1'">
        <StatusIcon
          v-if="slotProps.variant !== 'sections'"
          :status="slotProps.step.status"
          :is-final-item="slotProps.isFinalItem"
          :show-line="false"
          :level="slotProps.level"
        />

        <NuxtLink
          :to="slotProps.stepLink"
          class="group flex flex-1 flex-col gap-1 text-left"
          :class="slotProps.variant === 'sections' ? 'justify-between' : ''"
        >
          <div class="flex items-start gap-2" :class="slotProps.variant === 'sections' ? 'justify-between' : ''">
            <p
              class="text-sm font-medium text-[var(--sidebar-text-secondary)] group-hover:text-[var(--sidebar-primary)]"
              :class="slotProps.variant === 'sections' ? '' : 'group-hover:underline'"
            >
              {{ slotProps.step.title }}
            </p>
            <span
              v-if="slotProps.variant === 'sections'"
              class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
              :class="{
                'bg-[rgba(60,40,164,0.12)] text-[#3c28a4]': slotProps.step.status === 'completed',
                'bg-[rgba(240,156,0,0.12)] text-[#f09c00]': slotProps.step.status === 'current' || slotProps.step.status === 'in-progress',
                'bg-[rgba(103,100,114,0.12)] text-[#676472]': slotProps.step.status === 'optional',
                'bg-[rgba(220,38,38,0.12)] text-[#dc2626]': slotProps.step.status === 'error',
                'bg-[rgba(107,114,128,0.12)] text-[#6b7280]': slotProps.step.status === 'locked',
                'bg-[rgba(209,213,219,0.4)] text-[#4b5563]': !['completed','current','in-progress','optional','error','locked'].includes(slotProps.step.status),
              }"
            >
              {{ slotProps.step.status === 'completed'
                ? 'Completado'
                : slotProps.step.status === 'current' || slotProps.step.status === 'in-progress'
                ? 'En progreso'
                : slotProps.step.status === 'optional'
                ? 'Opcional'
                : slotProps.step.status === 'error'
                ? 'Error'
                : slotProps.step.status === 'locked'
                ? 'Bloqueado'
                : 'Pendiente' }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </StepItemBase>
</template>
