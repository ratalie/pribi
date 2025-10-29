<script setup lang="ts">
  import type { NavigationStep } from "~/types/navigationSteps";
  import CheckIcon from "./CheckIcon.vue";

  interface Props {
    steps: NavigationStep[];
  }

  defineProps<Props>();
</script>

<template>
  <div>
    <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-4">
      <CheckIcon :status="step.status" :is-final-item="index === steps.length - 1" />
      <NuxtLink :to="step.route" class="flex flex-col gap-1 cursor-pointer">
        <p
          class="font-primary font-medium text-gray-600 t-t1 hover:text-primary-800 transition-colors"
        >
          {{ step.title }}
        </p>
        <span class="font-secondary font-medium text-gray-600 t-b2">
          {{ step.description }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
