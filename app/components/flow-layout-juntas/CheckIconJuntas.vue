<script setup lang="ts">
  import CheckIconCircle from "./CheckIconCircle.vue";

  interface Props {
    status?: "empty" | "current" | "completed";
    isFinalItem?: boolean;
    /**
     * Clases CSS adicionales para el contenedor principal
     */
    containerClass?: string;
    /**
     * Clases CSS adicionales para el círculo
     */
    circleClass?: string;
    /**
     * Clases CSS adicionales para el icono Check
     */
    iconClass?: string;
    /**
     * Clases CSS adicionales para la línea conectora
     */
    lineClass?: string;
  }

  defineProps<Props>();
</script>

<template>
  <div :class="['flex flex-col justify-center items-center', containerClass]">
    <!-- Círculo del CheckIcon (usando componente separado) -->
    <CheckIconCircle :status="status" :circle-class="circleClass" :icon-class="iconClass" />

    <!-- Línea vertical conectora -->
    <div
      v-if="!isFinalItem"
      :class="[
        'w-0.5 h-8 relative transition-colors duration-300',
        {
          'bg-gray-300': status === 'empty',
          'bg-primary-800': status === 'current' || status === 'completed',
        },
        lineClass,
      ]"
    />
  </div>
</template>
