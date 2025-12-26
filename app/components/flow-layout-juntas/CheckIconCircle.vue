<script setup lang="ts">
  import { getIcon } from "~/utils/iconMapper";

  interface Props {
    status?: "empty" | "current" | "completed";
    /**
     * Clases CSS adicionales para el contenedor del círculo
     */
    circleClass?: string;
    /**
     * Clases CSS adicionales para el icono Check (solo cuando status === "completed")
     */
    iconClass?: string;
  }
  defineProps<Props>();

  const CheckIcon = getIcon("Check");
</script>

<template>
  <div
    :class="[
      'w-6 h-6 flex items-center justify-center border-2 rounded-full',
      // Estado vacío
      status === 'empty' || !status
        ? 'border-gray-300'
        : // Estado actual
        status === 'current'
        ? 'border-primary-800'
        : // Estado completado
          'bg-primary-800 border-primary-800',
      circleClass,
    ]"
  >
    <!-- Punto para estado current -->
    <span v-if="status === 'current'" class="w-2.5 h-2.5 rounded-full bg-primary-800" />

    <!-- Icono Check para estado completed -->
    <component
      v-else-if="status === 'completed' && CheckIcon"
      :is="CheckIcon"
      :class="['text-white w-4 h-4', iconClass]"
    />
  </div>
</template>
