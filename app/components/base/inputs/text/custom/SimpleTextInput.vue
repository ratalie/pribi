<!-- app/components/base/inputs/text/custom/SimpleTextInput.vue -->
<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, computed, watch } from "vue";

interface Props {
  modelValue?: string;
  label?: string;
  labelId?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  variant?: "default" | "error" | "success";
  size?: "sm" | "md" | "lg";
  showValidation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: "",
  labelId: "",
  placeholder: "",
  required: false,
  disabled: false,
  readonly: false,
  maxLength: undefined,
  variant: "default",
  size: "md",
  showValidation: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  blur: [value: string];
  focus: [];
}>();

// 👇 Referencia al Input
const inputRef = ref<HTMLInputElement>();

// 👇 Valor local reactivo
const localValue = ref(props.modelValue || "");

// 👇 Watcher para sincronizar
watch(localValue, (newValue) => {
  emit("update:modelValue", newValue);
  emit("input", newValue);
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
  () =>
    props.labelId || `simple-input-${Math.random().toString(36).substr(2, 9)}`
);

// 👇 Manejadores de eventos
const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("blur", target.value);
};

const handleFocus = () => {
  emit("focus");
};

// 👇 Clases CSS dinámicas
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
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<template>
  <div class="space-y-1">
    <!-- 👇 Label opcional -->
    <Label v-if="props.label" :for="inputId" class="text-sm font-medium">
      {{ props.label }}
    </Label>

    <!-- 👇 Input simple -->
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
</template>
