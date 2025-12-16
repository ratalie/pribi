<template>
  <div class="rounded-lg border border-primary-200 bg-primary-50/30 p-4">
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        <span class="font-medium">Total de aportantes seleccionados:</span>
        <span class="ml-2 font-bold text-primary-700">
          {{ totalSeleccionados }}
        </span>
      </div>
      <div class="text-sm text-gray-700">
        <span class="font-medium">Total de acciones:</span>
        <span class="ml-2 font-bold text-primary-700">
          {{ totalAcciones.toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalSeleccionados: number;
  totalAcciones: number;
}

defineProps<Props>();
</script>

