<script setup lang="ts">
import { Search } from "lucide-vue-next";

interface Props {
  modelValue: string;
  currentScope?: "dashboard" | "societarios" | "generados" | "personalizadas";
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentScope: "dashboard",
  placeholder: "Buscar en todo el repositorio...",
});

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emits("update:modelValue", value),
});
</script>

<template>
  <div class="relative">
    <Search
      class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
      :style="{ color: 'var(--text-muted)' }"
    />
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-12 pr-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 transition-all"
      :style="{
        borderColor: 'var(--border-light)',
        fontFamily: 'var(--font-secondary)',
      }"
      @focus="
        ($event.target as HTMLInputElement).style.borderColor = 'var(--primary-700)';
        ($event.target as HTMLInputElement).style.ringColor = 'var(--primary-700)';
      "
      @blur="
        ($event.target as HTMLInputElement).style.borderColor = 'var(--border-light)';
      "
    />
  </div>
</template>

