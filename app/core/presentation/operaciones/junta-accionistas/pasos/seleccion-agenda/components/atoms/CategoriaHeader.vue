<template>
  <button
    type="button"
    @click="$emit('toggle')"
    class="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <div class="flex items-center gap-2">
      <ChevronDown
        v-if="isExpanded"
        class="w-4 h-4"
        style="color: var(--text-muted, #6b7280)"
      />
      <ChevronRight
        v-else
        class="w-4 h-4"
        style="color: var(--text-muted, #6b7280)"
      />
      <span
        class="text-sm font-secondary font-semibold"
        style="color: var(--text-primary, #111827)"
      >
        {{ categoria }}
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronRight } from "lucide-vue-next";

interface Props {
  categoria: string;
  isExpanded: boolean;
}

defineProps<Props>();

defineEmits<{
  toggle: [];
}>();
</script>

