<script setup lang="ts">
  /**
   * StepWizardPanel - Panel de pasos estilo wizard
   * UI basada en ProgressNavBar de Registro de Sociedades
   *
   * Características:
   * - Lista secuencial de pasos
   * - Checkmarks para completados
   * - Líneas conectoras verticales
   * - Hover effects profesionales
   * - Soporta jerarquías (a diferencia de Registro de Sociedades)
   */

  import type { NavigationStep } from "~/types/navigationSteps";
  import StepItem from "../shared/StepItem.vue";

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

  // 🐛 DEBUG: Log del árbol de pasos al montar
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
  // Calcular el índice del próximo item del mismo o menor nivel
  const getNextSameLevelIndex = (
    currentIndex: number,
    currentLevel: number
  ): number | null => {
    for (let i = currentIndex + 1; i < props.steps.length; i++) {
      const step = props.steps[i];
      if (!step) continue;

      const stepLevel = step.level ?? 0;

      // Si encontramos un item del mismo nivel o menor (más importante)
      if (stepLevel <= currentLevel) {
        return i;
      }
    }
    return null; // No hay próximo item del mismo nivel
  };
</script>

<template>
  <div class="step-wizard-panel">
    <!-- Título opcional -->
    <h3 v-if="showTitle && title" class="panel-title">{{ title }}</h3>

    <!-- Lista de pasos -->
    <div class="steps-list">
      <StepItem
        v-for="(step, index) in steps"
        :key="step.route"
        :step="step"
        :index="index"
        :total-steps="steps.length"
        :variant="variant"
        :next-same-level-index="getNextSameLevelIndex(index, step.level ?? 0)"
      />
    </div>

    <!-- Mensaje si no hay pasos -->
    <div v-if="steps.length === 0" class="empty-state">
      <p class="text-gray-500 text-sm">No hay pasos disponibles</p>
    </div>
  </div>
</template>

<style scoped>
  /* Estilos basados en ProgressNavBar de Registro de Sociedades */

  .step-wizard-panel {
    display: flex;
    flex-direction: column;
    gap: 0; /* Los gaps están en los StepItems */
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
