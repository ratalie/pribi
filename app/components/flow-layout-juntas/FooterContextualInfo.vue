<script setup lang="ts">
  interface Props {
    currentSubStepId?: string;
    currentStepTitle: string;
    currentSectionTitle?: string;
    stepCounter: string;
  }

  const props = defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <!-- Paso actual -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-secondary uppercase tracking-wide text-gray-600">
          {{ currentSubStepId ? "Punto de Acuerdo" : "Paso" }}
        </span>
        <span class="text-sm font-primary font-semibold text-gray-900">
          {{ currentStepTitle }}
        </span>
      </div>
      <!-- Sección actual (solo si hay sub-step) -->
      <div v-if="currentSubStepId && currentSectionTitle" class="flex items-center gap-2">
        <span class="text-xs font-secondary uppercase tracking-wide text-gray-600">
          Sección:
        </span>
        <span class="text-xs font-primary font-medium text-gray-600">
          {{ currentSectionTitle }}
        </span>
      </div>
    </div>
    <!-- Contador de pasos -->
    <div class="text-xs font-secondary text-gray-600">
      {{ stepCounter }}
    </div>
  </div>
</template>
