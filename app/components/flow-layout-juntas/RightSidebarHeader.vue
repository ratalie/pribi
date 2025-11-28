<script setup lang="ts">
  interface Props {
    title: string;
  }

  const props = defineProps<Props>();
</script>

<template>
  <div class="px-6 py-4 border-b border-gray-200">
    <h3 class="text-sm font-primary font-semibold text-gray-600 uppercase tracking-wide">
      {{ title }}
    </h3>
  </div>
</template>
