<script setup lang="ts">
  import type { NavigationStep } from "~/types/navigationSteps";

  interface Props {
    steps: NavigationStep[];
  }

  defineProps<Props>();

  function isShort(text: string, max: number = 15) {
    return text.length <= max;
  }
</script>

<template>
  <div class="h-26 flex flex-col justify-center px-4 gap-4 border-y">
    <h1 class="text-2xl font-bold">Agregar nueva sociedad</h1>
    <div class="flex gap-4">
      <div
        v-for="step in steps"
        :key="step.title"
        class="flex items-center gap-2 t-b1 font-secondary text-gray-600"
      >
        <p :class="isShort(step.title) ? '' : 'truncate max-w-16 whitespace-nowrap'">
          {{ step.title }}
        </p>
        <component
          :is="getIcon('ChevronRight')"
          v-if="getIcon('ChevronRight')"
          class="w-3 h-3"
        />
      </div>
    </div>
  </div>
</template>
