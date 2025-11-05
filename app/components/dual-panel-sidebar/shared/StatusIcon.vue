<script setup lang="ts">
/**
 * StatusIcon - Icono de estado con línea conectora
 * Basado en CheckIcon de Registro de Sociedades pero mejorado
 * 
 * Soporta 5 estados: completed, current, empty, locked, error
 */

type Status = "completed" | "current" | "empty" | "locked" | "error";

interface Props {
  status?: Status;
  isFinalItem?: boolean;
  showLine?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  status: "empty",
  isFinalItem: false,
  showLine: true,
});

// Clase para la línea conectora según estado
const lineClass = computed(() => {
  switch (props.status) {
    case "completed":
    case "current":
      return "bg-primary-800";
    case "empty":
    case "locked":
      return "bg-gray-300";
    case "error":
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
});
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <!-- Completado: círculo azul con check blanco -->
    <div
      v-if="status === 'completed'"
      class="w-7 h-7 flex items-center justify-center border-2 bg-primary-800 border-primary-800 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-white"
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- Actual: círculo azul con punto blanco -->
    <div
      v-else-if="status === 'current'"
      class="w-7 h-7 flex items-center justify-center border-2 border-primary-800 rounded-full"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-primary-800" />
    </div>

    <!-- Bloqueado: círculo gris con candado -->
    <div
      v-else-if="status === 'locked'"
      class="w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-gray-400"
        width="16"
        height="16"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          d="M10 2a5 5 0 0 0-5 5v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H7V7a3 3 0 0 1 5.905-.75a1 1 0 0 0 1.937-.5A5.002 5.002 0 0 0 10 2"
        />
      </svg>
    </div>

    <!-- Error: círculo rojo con X blanca -->
    <div
      v-else-if="status === 'error'"
      class="w-7 h-7 flex items-center justify-center border-2 bg-red-500 border-red-500 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        class="text-white"
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10L4.293 5.707a1 1 0 0 1 0-1.414"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <!-- Vacío: círculo gris vacío -->
    <div
      v-else
      class="w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded-full"
    />

    <!-- Línea conectora vertical -->
    <div
      v-if="!isFinalItem && showLine"
      :class="['w-0.5 h-8 relative transition-colors duration-300', lineClass]"
    />
  </div>
</template>

