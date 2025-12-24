<template>
  <div class="relative flex items-center">
    <Search class="absolute left-3 w-4 h-4" style="color: var(--text-muted)" />
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      type="text"
      class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      style="color: var(--text-primary); font-family: var(--font-secondary)"
      @input="handleInput"
      @keyup.enter="$emit('search', modelValue)"
    />
  </div>
</template>

<script setup lang="ts">
  import { Search } from "lucide-vue-next";

  interface Props {
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    placeholder: "Buscar...",
    disabled: false,
  });

  const emit = defineEmits<{
    "update:modelValue": [value: string];
    search: [value: string];
  }>();

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
  };
</script>


