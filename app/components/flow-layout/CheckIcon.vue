<script setup lang="ts">
  interface Props {
    status?: "empty" | "current" | "completed";
    isFinalItem?: boolean;
  }

  defineProps<Props>();
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <!-- circulo vacio -->
    <div
      v-if="status === 'empty' || !status"
      class="w-7 h-7 flex items-center justify-center border-2 border-gray-300 rounded-full"
    />

    <!-- circulo con punto -->
    <div
      v-else-if="status === 'current'"
      class="w-7 h-7 flex items-center justify-center border-2 border-primary-800 rounded-full"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-primary-800" />
    </div>

    <!-- icono check -->
    <div
      v-else-if="status === 'completed'"
      class="w-7 h-7 flex items-center justify-center border-2 bg-primary-800 border-primary-800 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="text-white iconify iconify--heroicons-solid"
        width="20"
        height="20"
        preserveAspectRatio="xMidYMid meet"
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

    <!-- linea vertical -->
    <div
      v-if="!isFinalItem"
      :class="[
        'w-0.5 h-8 relative transition-colors duration-300',
        {
          'bg-gray-300': status === 'empty',
          'bg-primary-800': status === 'current' || status === 'completed',
        },
      ]"
    />
  </div>
</template>
