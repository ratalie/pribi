<template>
  <div
    class="w-full h-full border border-gray-100 rounded-xl p-10 bg-gray-50 flex items-center justify-center"
  >
    <p class="text-gray-500 text-center">{{ title }}</p>
  </div>
</template>
<script setup lang="ts">
  interface Props {
    title?: string;
  }

  withDefaults(defineProps<Props>(), {
    title: "Componente",
  });
</script>
