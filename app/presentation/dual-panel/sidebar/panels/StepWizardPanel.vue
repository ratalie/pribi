<script setup lang="ts">
import type { NavigationStep } from "~/types/navigationSteps";
import StepRenderer from "../shared/StepRenderer.vue";

type PanelVariant = "default" | "sections";

interface Props {
  steps: NavigationStep[];
  title?: string;
  showTitle?: boolean;
  variant?: PanelVariant;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  showTitle: false,
  variant: "default",
});

onMounted(() => {
  console.log("=".repeat(80));
  console.log("🔍 [StepWizardPanel] Árbol de Pasos:");
  console.log("=".repeat(80));

  props.steps.forEach((step, index) => {
    const indent = "  ".repeat(step.level ?? 0);
    const prefix = step.isCategory ? "📁" : "📄";
    const status = `[${step.status}]`;

    console.log(
      `${indent}${prefix} ${index}. ${step.title} ${status} (nivel: ${step.level ?? 0})`
    );
  });

  console.log("=".repeat(80));
});

const getNextSameLevelIndex = (
  currentIndex: number,
  currentLevel: number
): number | null => {
  for (let i = currentIndex + 1; i < props.steps.length; i++) {
    const step = props.steps[i];
    if (!step) continue;

    const stepLevel = step.level ?? 0;

    if (stepLevel <= currentLevel) {
      return i;
    }
  }
  return null;
};
</script>

<template>
  <div class="step-wizard-panel">
    <h3 v-if="showTitle && title" class="panel-title">{{ title }}</h3>

    <div class="steps-list">
      <StepRenderer
        v-for="(step, index) in steps"
        :key="step.route ?? `${step.hash}-${index}`"
        :step="step"
        :index="index"
        :total-steps="steps.length"
        :variant="variant"
        :next-same-level-index="getNextSameLevelIndex(index, step.level ?? 0)"
      />
    </div>

    <div v-if="steps.length === 0" class="empty-state">
      <p class="text-gray-500 text-sm">No hay pasos disponibles</p>
    </div>
  </div>
</template>

<style scoped>
  .step-wizard-panel {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .panel-title {
    font-family: var(--font-primary);
    font-weight: 600;
    font-size: 18px;
    color: #1f2937;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }

  .steps-list {
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    padding: 24px;
    text-align: center;
  }
</style>
