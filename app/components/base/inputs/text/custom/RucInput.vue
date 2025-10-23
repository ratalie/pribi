<!-- app/components/base/inputs/text/custom/RucInput.vue -->
<script setup lang="ts">
import SearchInput from "../ui/SearchInput.vue";
import type {
  BaseTextInputProps,
  TextInputValidation,
} from "@/types/inputs/text";
import { ref, computed } from "vue";

interface Props extends BaseTextInputProps {
  modelValue?: string;
  variant?: "default" | "error" | "success";
  size?: "sm" | "md" | "lg";
  showValidation?: boolean;
  label?: string;
  labelId?: string;
  showCharacterCount?: boolean;
  customClasses?: string;
  showSearchIcon?: boolean;
  iconPosition?: "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  variant: "default",
  size: "md",
  showValidation: true,
  label: "RUC",
  labelId: "ruc-input",
  showCharacterCount: true,
  customClasses: "",
  showSearchIcon: true,
  iconPosition: "right",
  // Props específicas para RUC
  placeholder: "Ingresa el número",
  required: true,
  maxLength: 11,
  minLength: 11,
  disabled: false,
  readonly: false,
  autoCapitalize: false,
  autoTrim: true,
  autoUpperCase: false,
  validationType: "ruc", // 👇 Tipo de validación específico para RUC
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  blur: [value: string];
  focus: [];
  validation: [validation: TextInputValidation];
}>();

// 👇 Referencia al SearchInput
const searchInputRef = ref();

// 👇 Contador de caracteres
const characterCount = ref(0);

// 👇 Manejador de input para el contador
const handleInput = (value: string) => {
  characterCount.value = value.length;
  console.log("RUC escrito:", value);
  emit("input", value);
};

// 👇 Manejador de validación
const handleValidation = (validation: TextInputValidation) => {
  emit("validation", validation);
};

// 👇 Exponer métodos del SearchInput
defineExpose({
  validation: computed(() => searchInputRef.value?.validation),
  isValid: computed(() => searchInputRef.value?.isValid),
  errorMessage: computed(() => searchInputRef.value?.errorMessage),
  sanitizedValue: computed(() => searchInputRef.value?.sanitizedValue),
  focus: () => searchInputRef.value?.focus(),
  blur: () => searchInputRef.value?.blur(),
});
</script>

<template>
  <div class="space-y-2">
    <!-- 👇 SearchInput con validación de RUC -->
    <SearchInput
      ref="searchInputRef"
      v-bind="props"
      :label="props.label"
      :label-id="props.labelId"
      :placeholder="props.placeholder"
      :validation-type="props.validationType"
      :show-search-icon="props.showSearchIcon"
      :icon-position="props.iconPosition"
      @update:model-value="emit('update:modelValue', $event)"
      @input="handleInput"
      @validation="handleValidation"
    />

    <!-- 👇 Contador de caracteres -->
    <div v-if="showCharacterCount" class="text-xs text-gray-500 text-right">
      {{ characterCount }}/{{ props.maxLength }}
    </div>
  </div>
</template>
