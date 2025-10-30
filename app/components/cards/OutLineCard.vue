<script setup lang="ts">
  interface Props {
    title?: string;
    value?: string;
  }

  defineProps<Props>();
</script>

<template>
  <div
    class="border border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2"
  >
    <p class="font-secondary font-extrabold t-b1 text-gray-700">{{ title }}</p>
    <span class="font-secondary font-bold t-b1 text-gray-700">{{ value }}</span>
  </div>
</template>
