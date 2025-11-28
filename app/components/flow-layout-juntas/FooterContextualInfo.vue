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
        <span
          class="text-xs font-secondary uppercase tracking-wide"
          style="color: var(--text-muted, #6b7280)"
        >
          {{ currentSubStepId ? "Punto de Acuerdo" : "Paso" }}
        </span>
        <span
          class="text-sm font-primary font-semibold"
          style="color: var(--text-primary, #111827)"
        >
          {{ currentStepTitle }}
        </span>
      </div>
      <!-- Sección actual (solo si hay sub-step) -->
      <div
        v-if="currentSubStepId && currentSectionTitle"
        class="flex items-center gap-2"
      >
        <span
          class="text-xs font-secondary uppercase tracking-wide"
          style="color: var(--text-muted, #6b7280)"
        >
          Sección:
        </span>
        <span
          class="text-xs font-primary font-medium"
          style="color: var(--text-muted, #6b7280)"
        >
          {{ currentSectionTitle }}
        </span>
      </div>
    </div>
    <!-- Contador de pasos -->
    <div class="text-xs font-secondary" style="color: var(--text-muted, #6b7280)">
      {{ stepCounter }}
    </div>
  </div>
</template>

