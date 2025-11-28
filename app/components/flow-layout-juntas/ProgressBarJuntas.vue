<script setup lang="ts">
  interface Props {
    current: number;
    total: number;
  }

  const props = defineProps<Props>();

  const progressPercentage = computed(() => {
    return Math.round((props.current / props.total) * 100);
  });
</script>

<template>
  <div class="mb-6">
    <!-- Barra de progreso -->
    <div
      class="h-2 rounded-full overflow-hidden transition-all duration-300"
      style="background-color: var(--primary-100, #e5e7eb)"
    >
      <div
        class="h-full transition-all duration-300 rounded-full"
        :style="{
          width: `${progressPercentage}%`,
          backgroundColor: 'var(--primary-800, #3C28A4)',
        }"
      />
    </div>
    <!-- Porcentaje -->
    <p
      class="text-xs mt-2 text-right font-secondary"
      style="color: var(--text-muted, #6b7280); font-family: var(--font-secondary, sans-serif)"
    >
      {{ progressPercentage }}% completado
    </p>
  </div>
</template>
