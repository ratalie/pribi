<!-- app/components/base/inputs/text/custom/NameInput.vue -->
<script setup lang="ts">
import TextInput from "../ui/TextInput.vue";
import type {
  TextInputValidation,
  BaseTextInputProps,
} from "@/types/inputs/text";
import { ref, computed } from "vue";

interface Props extends BaseTextInputProps {
  modelValue?: string;
  nameType?: "first" | "last" | "full";
  showCharacterCount?: boolean;
  customClasses?: string;
  label?: string;
  labelId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  nameType: "full",
  showCharacterCount: false,
  customClasses: "",
  // Props base con valores por defecto específicos para nombres
  label: "Nombre Completo",
  labelId: "nombre-completo",
  placeholder: "Ingresa tu nombre",
  required: false,
  maxLength: 50,
  minLength: 2,
  disabled: false,
  readonly: false,
  autoCapitalize: true,
  autoTrim: true,
  autoUpperCase: false,
  validationType: "nombre",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  blur: [value: string];
  focus: [];
  validation: [validation: TextInputValidation];
}>();

const textInputRef = ref();
const characterCount = ref(0);

const handleInput = (value: string) => {
  characterCount.value = value.length;
  emit("input", value);
};

const handleValidation = (validation: TextInputValidation) => {
  emit("validation", validation);
};

// Placeholder específico según el tipo de nombre
const dynamicPlaceholder = computed(() => {
  switch (props.nameType) {
    case "first":
      return "Nombre";
    case "last":
      return "Apellido";
    case "full":
      return "Nombre completo";
    default:
      return props.placeholder;
  }
});

// Validación específica según el tipo de nombre
const dynamicValidationType = computed(() => {
  switch (props.nameType) {
    case "first":
      return "nombre";
    case "last":
      return "nombre";
    case "full":
      return "nombre_completo";
    default:
      return "nombre";
  }
});

// Exponer métodos del TextInput
defineExpose({
  validation: computed(() => textInputRef.value?.validation),
  isValid: computed(() => textInputRef.value?.isValid),
  errorMessage: computed(() => textInputRef.value?.errorMessage),
  focus: () => textInputRef.value?.focus(),
  blur: () => textInputRef.value?.blur(),
});
</script>

<template>
  <div class="space-y-2">
    <!-- Input de nombre usando TextInput -->
    <TextInput
      ref="textInputRef"
      v-bind="props"
      :label="props.label"
      :label-id="props.labelId"
      :placeholder="dynamicPlaceholder"
      :validation-type="dynamicValidationType"
      @update:model-value="emit('update:modelValue', $event)"
      @input="handleInput"
      @validation="handleValidation"
    />

    <!-- Contador de caracteres -->
    <div v-if="showCharacterCount" class="text-xs text-gray-500 text-right">
      {{ characterCount }}/{{ props.maxLength }}
    </div>
  </div>
</template>
