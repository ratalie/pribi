<script setup lang="ts">
/**
 * StepItem - Item de paso individual
 * Basado en el diseño de ProgressNavBar de Registro de Sociedades
 * 
 * Muestra: StatusIcon + Título + Descripción con hover effects
 */

import type { NavigationStep } from "~/types/navigationSteps";
import StatusIcon from "./StatusIcon.vue";

interface Props {
  step: NavigationStep;
  index: number;
  totalSteps: number;
  showLine?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showLine: true,
});

const isFinalItem = computed(() => props.index === props.totalSteps - 1);
</script>

<template>
  <div class="flex items-start gap-4">
    <!-- Status Icon con línea conectora -->
    <StatusIcon
      :status="step.status"
      :is-final-item="isFinalItem"
      :show-line="showLine"
    />

    <!-- Contenido del paso -->
    <NuxtLink :to="step.route" class="flex flex-col gap-1 cursor-pointer group flex-1">
      <!-- Título -->
      <p
        class="font-primary font-medium text-gray-600 t-t1 group-hover:text-primary-800 transition-colors group-hover:underline"
      >
        {{ step.title }}
      </p>

      <!-- Descripción -->
      <span
        class="font-secondary font-medium text-gray-600 t-b2 group-hover:underline"
      >
        {{ step.description }}
      </span>
    </NuxtLink>
  </div>
</template>

<style scoped>
/* Estilos basados en Registro de Sociedades */

/* t-t1: Typography Title 1 */
.t-t1 {
  font-size: 16px;
  line-height: 1.5;
}

/* t-b2: Typography Body 2 */
.t-b2 {
  font-size: 14px;
  line-height: 1.5;
}
</style>

