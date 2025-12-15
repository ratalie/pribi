<template>
  <div class="flex items-center gap-2">
    <label
      class="text-xs font-secondary font-medium"
      style="color: var(--text-secondary, #4b5563)"
    >
      Junta Obligatoria Anual
    </label>
    <button
      type="button"
      @click="$emit('toggle')"
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      :style="{
        backgroundColor: isEnabled
          ? 'var(--primary-800, #5b21b6)'
          : 'var(--gray-300, #d1d5db)',
      }"
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        :class="isEnabled ? 'translate-x-6' : 'translate-x-1'"
      />
    </button>
    <!-- Tooltip Info -->
    <div class="relative group">
      <Info class="w-4 h-4 cursor-pointer" style="color: var(--text-muted, #6b7280)" />
      <!-- Tooltip -->
      <div
        v-if="isEnabled"
        class="absolute right-0 top-8 w-64 p-3 bg-white border rounded-lg shadow-lg z-50"
        style="border-color: var(--border-default, #e5e7eb)"
      >
        <p
          class="text-xs font-semibold mb-1 font-primary"
          style="color: var(--text-primary, #111827)"
        >
          A tener en cuenta
        </p>
        <p
          class="text-xs font-secondary"
          style="color: var(--text-secondary, #4b5563)"
        >
          Una Junta Obligatoria Anual debe incluir al menos los siguientes puntos de
          agenda.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Info } from "lucide-vue-next";

interface Props {
  isEnabled: boolean;
}

defineProps<Props>();

defineEmits<{
  toggle: [];
}>();
</script>

