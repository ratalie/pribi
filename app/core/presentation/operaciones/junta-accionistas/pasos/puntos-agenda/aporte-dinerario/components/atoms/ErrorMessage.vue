<template>
  <div v-if="message" class="p-4 bg-red-50 border border-red-200 rounded-md">
    <p class="text-sm text-red-600">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string | null;
}

defineProps<Props>();
</script>





