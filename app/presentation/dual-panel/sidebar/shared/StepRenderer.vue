<script setup lang="ts">
import type { NavigationStep } from "~/types/navigationSteps";
import Level0Item from "./items/Level0Item.vue";
import Level1Item from "./items/Level1Item.vue";
import Level2Item from "./items/Level2Item.vue";
import Level3Item from "./items/Level3Item.vue";
import Level4Item from "./items/Level4Item.vue";

interface Props {
  step: NavigationStep;
  index: number;
  totalSteps: number;
  variant?: "default" | "sections";
  nextSameLevelIndex?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  nextSameLevelIndex: null,
});

const level = computed(() => props.step.level ?? 0);

const componentByLevel = computed(() => {
  const lvl = level.value;
  if (props.variant === "sections") {
    if (lvl >= 4) return Level4Item;
    return Level3Item;
  }

  switch (true) {
    case lvl <= 0:
      return Level0Item;
    case lvl === 1:
      return Level1Item;
    case lvl === 2:
      return Level2Item;
    case lvl === 3:
      return Level3Item;
    default:
      return Level4Item;
  }
});
</script>

<template>
  <component
    :is="componentByLevel"
    :step="step"
    :index="index"
    :total-steps="totalSteps"
    :variant="variant"
    :next-same-level-index="nextSameLevelIndex"
  />
</template>
