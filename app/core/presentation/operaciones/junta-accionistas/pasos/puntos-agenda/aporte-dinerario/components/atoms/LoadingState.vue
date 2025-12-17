<template>
  <div v-if="isLoading" class="flex items-center justify-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isLoading: boolean;
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: "Cargando...",
});
</script>





