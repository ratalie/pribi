<template>
  <div
    v-if="text"
    class="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
  >
    <Info class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
    <p class="t-b2 font-secondary text-blue-800">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Info } from 'lucide-vue-next';

interface Props {
  text: string;
  variant?: 'info' | 'warning';
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
});
</script>

