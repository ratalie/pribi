<template>
  <label class="flex items-start gap-3 cursor-pointer group">
    <Checkbox
      :model-value="isSelected"
      @update:model-value="(checked) => emit('toggle', !!checked)"
      class="mt-0.5"
    />
    <span
      class="text-sm group-hover:text-primary-700 transition-colors font-secondary"
      :style="{
        color: isSelected ? 'var(--primary-700, #7c3aed)' : 'var(--text-secondary, #4b5563)',
      }"
    >
      {{ title }}
    </span>
  </label>
</template>

<script setup lang="ts">
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";

  interface Props {
    puntoId: string;
    title: string;
    isSelected: boolean;
  }

  defineProps<Props>();

  const emit = defineEmits<{
    toggle: [checked: boolean];
  }>();
</script>

