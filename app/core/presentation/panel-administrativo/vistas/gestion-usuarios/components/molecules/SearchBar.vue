<script setup lang="ts">
import { Search } from "lucide-vue-next";

interface Props {
  modelValue: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Buscar usuario por email...",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const searchValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div class="flex-1 relative">
    <Search
      class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
      :style="{ color: 'var(--text-muted)' }"
    />
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
      :style="{
        borderColor: 'var(--border-light)',
        fontFamily: 'var(--font-secondary)',
      }"
      @focus="
        ($event.target as HTMLInputElement).style.borderColor = 'var(--primary-700)'
      "
      @blur="
        ($event.target as HTMLInputElement).style.borderColor = 'var(--border-light)'
      "
    />
  </div>
</template>




