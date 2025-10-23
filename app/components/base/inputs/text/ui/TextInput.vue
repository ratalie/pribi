<!-- app/components/base/inputs/text/ui/TextInput.vue -->
<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  BaseTextInputProps,
  TextInputValidation,
} from "@/types/inputs/text";
import { validateTextInput } from "@/utils/inputs/validation-rules";
import { ref, computed, watch } from "vue";

interface Props extends BaseTextInputProps {
  modelValue?: string;
  variant?: "default" | "error" | "success";
  size?: "sm" | "md" | "lg";
  showValidation?: boolean;
  label?: string;
  labelId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  variant: "default",
  size: "md",
  showValidation: true,
  label: "",
  labelId: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  blur: [value: string];
  focus: [];
  validation: [validation: TextInputValidation];
}>();

// 👇 Referencia al Input de shadcn-vue
const inputRef = ref<HTMLInputElement>();

// 👇 Valor local reactivo
const localValue = ref(props.modelValue || "");

// 👇 Watcher para sincronizar y validar
watch(localValue, (newValue) => {
  const validationResult = validateInput(newValue);
  emit("update:modelValue", validationResult.sanitizedValue);
  emit("input", validationResult.sanitizedValue);
});

// 👇 Watcher para sincronizar desde el padre
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue || "";
  }
);

// 👇 Generar ID único para el input si no se proporciona
const inputId = computed(
  () => props.labelId || `input-${Math.random().toString(36).substr(2, 9)}`
);

// 👇 Estado de validación
const validation = ref<TextInputValidation>({
  isValid: true,
  errorMessage: "",
  sanitizedValue: props.modelValue || "",
});

// 👇 Función para validar el input usando la función centralizada
const validateInput = (value: string) => {
  const validationResult = validateTextInput(value, props);

  validation.value = validationResult;
  emit("validation", validationResult);

  return validationResult;
};

// 👇 Manejadores de eventos (ya no necesarios para input, el watcher se encarga)

const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const validationResult = validateInput(target.value);

  emit("blur", validationResult.sanitizedValue);

  if (props.onBlur) {
    props.onBlur(validationResult.sanitizedValue);
  }
};

const handleFocus = () => {
  emit("focus");

  if (props.onFocus) {
    props.onFocus();
  }
};

// 👇 Clases CSS dinámicas para el Input de shadcn-vue
const inputClasses = computed(() => [
  // Estilos base personalizados con !important para sobrescribir shadcn-vue
  "!border-gray-500 focus:!border-gray-700 focus:!border-2 focus:!outline-none focus:!ring-2 focus:!ring-[var(--color-outline-ring)] focus:!ring-offset-4",
  // Variantes
  {
    "border-red-500 focus:border-red-500 focus:ring-red-500":
      props.variant === "error",
    "border-green-500 focus:border-green-500 focus:ring-green-500":
      props.variant === "success",
    // 'default' usa los estilos personalizados de arriba
  },
  // Tamaños
  {
    "h-8 px-2 text-sm": props.size === "sm",
    "h-10 px-3 text-base": props.size === "md",
    "h-12 px-4 text-lg": props.size === "lg",
  },
]);

// 👇 Exponer métodos
defineExpose({
  validation: computed(() => validation.value),
  isValid: computed(() => validation.value.isValid),
  errorMessage: computed(() => validation.value.errorMessage),
  sanitizedValue: computed(() => validation.value.sanitizedValue),
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<template>
  <div class="space-y-1">
    <!-- 👇 Label opcional -->
    <Label v-if="props.label" :for="inputId" class="text-sm font-medium mb-2">
      {{ props.label }}
    </Label>

    <!-- 👇 Usar Input de shadcn-vue con las clases aplicadas -->
    <div class="relative">
      <Input
        :id="inputId"
        ref="inputRef"
        v-model="localValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :maxlength="props.maxLength"
        :required="props.required"
        type="text"
        :class="inputClasses"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>

    <!-- Mensaje de validación -->
    <div
      v-if="props.showValidation && validation.errorMessage"
      class="text-sm text-red-500"
    >
      {{ validation.errorMessage }}
    </div>
  </div>
</template>
