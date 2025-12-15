<template>
  <div
    class="flex items-center gap-3 text-sm p-3 rounded-lg transition-colors"
    style="
      background-color: var(--gray-50, #f9fafb);
      font-family: var(--font-secondary);
      cursor: default;
    "
  >
    <!-- Número global -->
    <span
      class="shrink-0 font-semibold font-secondary w-6 text-center"
      style="color: var(--primary-700, #7c3aed)"
    >
      {{ numero }}.
    </span>
    <!-- Título -->
    <span
      class="flex-1 font-secondary"
      style="color: var(--text-secondary, #4b5563)"
    >
      {{ title }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  puntoId: string;
  title: string;
  numero: number;
}

defineProps<Props>();
</script>

