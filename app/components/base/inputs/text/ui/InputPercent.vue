<script setup lang="ts">
  import { ref, watch } from "vue";
  import BaseInput from "../BaseInput.vue";

  interface Props {
    id: string;
    modelValue: string;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    placeholder?: string;
    isDisabled?: boolean;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", payload: string): void;
  }>();

  const internalValue = ref<string>(props.modelValue || props.placeholder || "");

  function getNumber(value: string): string {
    // Solo permite números
    const newValue = value.replace(/[^0-9]/g, "");

    // Si está vacío, retornar vacío
    if (newValue === "") return "";

    // Máximo 4 dígitos
    const clean = newValue.slice(0, 4).padStart(3, "0"); // Para casos como "5" → "005"

    const length = clean.length;

    if (length === 4) {
      // Por ejemplo: 6633 → 66.33
      const intPart = clean.slice(0, 2);
      const decimalPart = clean.slice(2, 4);
      return `${parseInt(intPart)}.${decimalPart}`;
    } else if (length === 3) {
      // Por ejemplo: 500 → 5.00
      const intPart = clean.slice(0, 1);
      const decimalPart = clean.slice(1, 3);
      return `${parseInt(intPart)}.${decimalPart}`;
    } else if (length === 2) {
      // Por ejemplo: 99 → 0.99
      return `0.${clean}`;
    } else if (length === 1) {
      // Por ejemplo: 5 → 0.05
      return `0.0${clean}`;
    }

    return "0.00";
  }

  const handleFormatValue = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const formattedValue = getNumber(target.value);
    internalValue.value = formattedValue;
    emits("update:modelValue", formattedValue);
  };

  // Sincronizar con el valor externo
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue === "" || newValue === null || newValue === undefined) {
        internalValue.value = "";
      } else if (newValue && newValue !== internalValue.value) {
        const formatted = getNumber(newValue);
        internalValue.value = formatted;
      }
    },
    { immediate: true }
  );

  watch(internalValue, (newValue) => {
    if (newValue !== props.modelValue) {
      emits("update:modelValue", newValue);
    }
  });
</script>

<template>
  <BaseInput
    :id="id"
    :model-value="internalValue"
    :variant="variant"
    :size="size"
    :placeholder="placeholder || '0.00'"
    type="text"
    :is-disabled="isDisabled"
    maxlength="5"
    v-bind="$attrs"
    @input="handleFormatValue"
  />
</template>
