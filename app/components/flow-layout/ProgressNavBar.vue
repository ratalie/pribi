<script setup lang="ts">
  import CheckIcon from "./CheckIcon.vue";

  const { steps } = useProgressNavbarRoutes();
</script>

<template>
  <div>
    <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-4">
      <CheckIcon :status="step.status" />
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
