<script setup lang="ts">
import { computed } from "vue";
import { List, Grid3x3 } from "lucide-vue-next";
import type { ViewMode } from "../../types/user-management.types";

interface Props {
  modelValue: ViewMode;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [mode: ViewMode];
}>();

const viewMode = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
    <button
      class="p-2 rounded transition-colors"
      :class="viewMode === 'table' ? 'bg-white shadow-sm' : ''"
      @click="viewMode = 'table'"
    >
      <List
        class="w-4 h-4"
        :style="{
          color: viewMode === 'table' ? 'var(--primary-700)' : 'var(--text-muted)',
        }"
      />
    </button>
    <button
      class="p-2 rounded transition-colors"
      :class="viewMode === 'cards' ? 'bg-white shadow-sm' : ''"
      @click="viewMode = 'cards'"
    >
      <Grid3x3
        class="w-4 h-4"
        :style="{
          color: viewMode === 'cards' ? 'var(--primary-700)' : 'var(--text-muted)',
        }"
      />
    </button>
  </div>
</template>

