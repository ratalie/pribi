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
    <div class="h-2 rounded-full overflow-hidden transition-all duration-300 bg-primary-100">
      <div
        class="h-full transition-all duration-300 rounded-full bg-primary-800"
        :style="{ width: `${progressPercentage}%` }"
      />
    </div>
    <!-- Porcentaje -->
    <p class="text-xs mt-2 text-right font-secondary text-gray-600">
      {{ progressPercentage }}% completado
    </p>
  </div>
</template>
