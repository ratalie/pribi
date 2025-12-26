<script setup lang="ts">
import type { NavigationStep } from "~/types/navigationSteps";

interface Props {
  currentStep?: NavigationStep;
}

const _props = defineProps<Props>();
</script>

<template>
  <div>
    <h1 class="text-xl mb-0.5 font-primary font-semibold text-gray-900">
      {{ currentStep?.title || "Junta de Accionistas" }}
    </h1>
    <p class="text-sm font-secondary text-gray-600">
      {{ currentStep?.description || "" }}
    </p>
  </div>
</template>

