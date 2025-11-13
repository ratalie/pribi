<script setup lang="ts">
  import type { NavigationStep } from "~/types/navigationSteps";
  import CheckIcon from "./CheckIcon.vue";

  interface Props {
    steps: NavigationStep[];
  }

  defineProps<Props>();

  const normalizeStatus = (status: NavigationStep["status"]): "completed" | "current" | "empty" => {
    if (status === "completed" || status === "current") {
      return status;
    }
    return "empty";
  };
</script>

<template>
  <div>
    <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-4">
      <CheckIcon :status="normalizeStatus(step.status)" :is-final-item="index === steps.length - 1" />
      <NuxtLink :to="step.route" class="flex flex-col gap-1 cursor-pointer group">
        <p
          class="font-primary font-medium text-gray-600 t-t1 group-hover:text-primary-800 transition-colors group-hover:underline"
        >
          {{ step.title }}
        </p>
        <span class="font-secondary font-medium text-gray-600 t-b2 group-hover:underline">
          {{ step.description }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
