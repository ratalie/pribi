<script setup lang="ts">
import { computed, onMounted } from "vue";
import type { NavigationStep } from "~/types/navigationSteps";

export type StepVariant = "default" | "sections";

interface Props {
  step: NavigationStep;
  index: number;
  totalSteps: number;
  variant?: StepVariant;
  nextSameLevelIndex?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  nextSameLevelIndex: null,
});

const isFinalItem = computed(() => props.index === props.totalSteps - 1);
const level = computed(() => props.step.level ?? 0);
const isCategory = computed(() => props.step.isCategory === true);
const showDescription = computed(() => props.variant !== "sections" && level.value <= 1);

const stepLink = computed(() => {
  const route = props.step.route;
  const hash = props.step.hash;

  if (hash) {
    return { path: route, hash };
  }

  return route;
});

const emit = defineEmits<{ (e: "render", payload: { step: NavigationStep; level: number }): void }>();

onMounted(() => {
  emit("render", { step: props.step, level: level.value });
});
</script>

<template>
  <slot
    :step="step"
    :is-final-item="isFinalItem"
    :is-category="isCategory"
    :step-link="stepLink"
    :show-description="showDescription"
    :level="level"
    :variant="variant"
    :next-same-level-index="nextSameLevelIndex"
  />
</template>
