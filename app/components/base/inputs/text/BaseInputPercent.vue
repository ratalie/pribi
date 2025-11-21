<script setup lang="ts">
  import { ref, watch } from "vue";
  import BaseInput from "./BaseInput.vue";

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

  function getNumber(value: string, formatOnBlur: boolean = false): string {
    // Permitir números, punto decimal y eliminar otros caracteres
    let cleaned = value.replace(/[^0-9.]/g, "");

    // Si está vacío, retornar vacío
    if (cleaned === "") return "";

    // Permitir solo un punto decimal
    let parts = cleaned.split(".");
    if (parts.length > 2) {
      // Si hay más de un punto, mantener solo el primero
      cleaned = parts[0] + "." + parts.slice(1).join("");
      parts = cleaned.split("."); // Recalcular parts después de modificar cleaned
    }

    // Limitar decimales a máximo 2 dígitos
    if (parts.length === 2 && parts[1] && parts[1].length > 2) {
      cleaned = parts[0] + "." + parts[1].slice(0, 2);
      parts = cleaned.split("."); // Recalcular parts
    }

    // Limitar la parte entera a máximo 3 dígitos (para valores hasta 100)
    if (parts[0] && parts[0].length > 3) {
      cleaned = parts[0].slice(0, 3) + (parts[1] ? "." + parts[1] : "");
    }

    // Si el valor es mayor a 100, limitarlo a 100
    const numericValue = parseFloat(cleaned);
    if (!Number.isNaN(numericValue) && numericValue > 100) {
      return "100.00";
    }

    // Si termina con punto, mantenerlo (el usuario está escribiendo)
    if (cleaned.endsWith(".")) {
      return cleaned;
    }

    // Solo formatear con 2 decimales si es onBlur o si el valor viene del exterior
    if (formatOnBlur && !cleaned.includes(".") && cleaned !== "") {
      const num = parseFloat(cleaned);
      if (!Number.isNaN(num)) {
        return num.toFixed(2);
      }
    }

    return cleaned;
  }

  const handleFormatValue = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    // No formatear automáticamente mientras el usuario escribe
    const formattedValue = getNumber(target.value, false);
    internalValue.value = formattedValue;
    emits("update:modelValue", formattedValue);
  };

  const handleBlur = (): void => {
    // Formatear con 2 decimales cuando el usuario termina de escribir
    if (internalValue.value && !internalValue.value.includes(".")) {
      const num = parseFloat(internalValue.value);
      if (!Number.isNaN(num)) {
        internalValue.value = num.toFixed(2);
        emits("update:modelValue", internalValue.value);
      }
    } else if (internalValue.value && internalValue.value.includes(".")) {
      // Si tiene decimales, asegurar que tenga 2 dígitos
      const parts = internalValue.value.split(".");
      if (parts[1] && parts[1].length === 1) {
        internalValue.value = parts[0] + "." + parts[1] + "0";
        emits("update:modelValue", internalValue.value);
      } else if (parts[1] && parts[1].length === 0) {
        internalValue.value = parts[0] + ".00";
        emits("update:modelValue", internalValue.value);
      }
    }
  };

  // Sincronizar con el valor externo
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue === "" || newValue === null || newValue === undefined) {
        internalValue.value = "";
      } else if (newValue && newValue !== internalValue.value) {
        // Cuando el valor viene del exterior, formatearlo correctamente
        internalValue.value = getNumber(newValue, true);
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
    maxlength="6"
    v-bind="$attrs"
    @input="handleFormatValue"
    @blur="handleBlur"
  />
</template>
