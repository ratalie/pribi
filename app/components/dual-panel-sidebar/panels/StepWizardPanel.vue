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

  withDefaults(defineProps<Props>(), {
    title: "",
    showTitle: false,
    variant: "default",
  });
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
