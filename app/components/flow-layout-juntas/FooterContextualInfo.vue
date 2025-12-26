<script setup lang="ts">
  interface Props {
    currentSubStepId?: string;
    currentStepTitle: string;
    currentSectionTitle?: string;
    stepCounter: string;
  }

  defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
    <div class="flex flex-col gap-1.5">
      <!-- Paso actual -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-secondary uppercase tracking-wide text-gray-500">
          {{ currentSubStepId ? "Punto de Agenda" : "Paso" }}
        </span>
        <span class="text-sm font-primary font-semibold text-gray-900">
          {{ currentStepTitle }}
        </span>
      </div>
      <!-- Sección actual (solo si hay sub-step) -->
      <div v-if="currentSubStepId && currentSectionTitle" class="flex items-center gap-2">
        <span class="text-xs font-secondary uppercase tracking-wide text-gray-500">
          Sección:
        </span>
        <span class="text-sm font-primary font-medium text-gray-700">
          {{ currentSectionTitle }}
        </span>
      </div>
    </div>
    <!-- Contador de pasos -->
    <div class="text-xs font-secondary font-medium text-gray-600 bg-white px-3 py-1.5 rounded-md border border-gray-200">
      {{ stepCounter }}
    </div>
  </div>
</template>
