<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <h3
      class="text-base font-semibold mb-5"
      style="color: var(--text-primary); font-family: var(--font-primary)"
    >
      Pasos del Proceso
    </h3>

    <!-- Grid de 2 columnas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="(step, index) in pasos"
        :key="step.number"
        class="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-colors"
      >
        <!-- Número del paso -->
        <div
          class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
          style="background-color: var(--primary-600)"
        >
          {{ step.number }}
        </div>

        <!-- Contenido -->
        <div class="flex-1 min-w-0">
          <h4
            class="text-sm font-medium mb-0.5"
            style="color: var(--text-primary); font-family: var(--font-primary)"
          >
            {{ step.title }}
          </h4>
          <p
            class="text-xs leading-relaxed"
            style="color: var(--text-muted); font-family: var(--font-secondary)"
          >
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Paso } from "../../types/paso.types";

  interface Props {
    pasos: Paso[];
    getColorClasses: (color: string) => { bg: string; text: string };
  }

  const props = defineProps<Props>();

  const getStepColor = (): string => {
    // Usar color primario unificado para todos los pasos
    return "var(--primary-600)";
  };
</script>
