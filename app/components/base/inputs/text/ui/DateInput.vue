<!-- app/components/base/inputs/text/ui/DateInput.vue -->
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { parseDate } from "@internationalized/date";
import type { CalendarDate } from "@internationalized/date";
import type {
  BaseDateInputProps,
  DateInputValidation,
} from "@/types/inputs/date";
import { validateDateInput } from "@/utils/inputs/validation-rules";
import { ref, computed, watch } from "vue";

interface Props extends BaseDateInputProps {
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
  placeholder: "Selecciona una fecha",
  required: false,
  disabled: false,
  dateFormat: "dd/MM/yyyy",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  blur: [value: string];
  focus: [];
  validation: [validation: DateInputValidation];
}>();

// 👇 Referencia al Dialog
const dialogRef = ref();

// 👇 Valor local reactivo (fecha en formato ISO)
const localValue = ref(props.modelValue || "");

// 👇 Flag para evitar bucles infinitos
const isUpdating = ref(false);

// 👇 Estado del dialog
const isOpen = ref(false);

// 👇 Watcher para sincronizar y validar
watch(localValue, (newValue) => {
  if (isUpdating.value) return; // Evitar bucle infinito

  console.log("DateInput - Fecha seleccionada:", newValue);

  // Validar la fecha
  const validationResult = validateInput(newValue);

  emit("update:modelValue", validationResult.sanitizedValue);
  emit("input", validationResult.sanitizedValue);
  emit("validation", validationResult);
});

// 👇 Watcher para sincronizar desde el padre
watch(
  () => props.modelValue,
  (newValue) => {
    if (isUpdating.value) return; // Evitar bucle infinito
    localValue.value = newValue || "";
  }
);

// 👇 Generar ID único para el input si no se proporciona
const inputId = computed(
  () => props.labelId || `date-input-${Math.random().toString(36).substr(2, 9)}`
);

// 👇 Estado de validación
const validation = ref<DateInputValidation>({
  isValid: true,
  errorMessage: "",
  sanitizedValue: props.modelValue || "",
  formattedValue: props.modelValue || "",
});

// 👇 Función para validar la fecha usando la función centralizada
const validateInput = (value: string) => {
  const validationResult = validateDateInput(value, props);

  validation.value = validationResult;
  emit("validation", validationResult);

  return validationResult;
};

// 👇 Convertir string ISO a CalendarDate para el componente Calendar
const calendarValue = computed({
  get: () => {
    if (!localValue.value) return undefined;
    try {
      return parseDate(localValue.value);
    } catch {
      return undefined;
    }
  },
  set: (value: CalendarDate | undefined) => {
    if (value) {
      localValue.value = value.toString();
    } else {
      localValue.value = "";
    }
  },
});

// 👇 Fechas mínima y máxima para el calendario
const minCalendarDate = computed(() => {
  if (!props.minDate) return undefined;
  try {
    return parseDate(props.minDate);
  } catch {
    return undefined;
  }
});

const maxCalendarDate = computed(() => {
  if (!props.maxDate) return undefined;
  try {
    return parseDate(props.maxDate);
  } catch {
    return undefined;
  }
});

// 👇 Texto a mostrar en el botón
const displayText = computed(() => {
  if (!localValue.value) return props.placeholder;

  try {
    const date = new Date(localValue.value);
    if (isNaN(date.getTime())) return props.placeholder;

    return validation.value.formattedValue || props.placeholder;
  } catch {
    return props.placeholder;
  }
});

// 👇 Manejadores de eventos
const handleDateSelect = (value: CalendarDate | undefined) => {
  if (value) {
    localValue.value = value.toString();
  } else {
    localValue.value = "";
  }
  isOpen.value = false; // Cerrar el dialog después de seleccionar
};

const handleBlur = () => {
  const validationResult = validateInput(localValue.value);
  emit("blur", localValue.value);
  emit("validation", validationResult);

  if (props.onBlur) {
    props.onBlur(localValue.value);
  }
};

const handleFocus = () => {
  emit("focus");

  if (props.onFocus) {
    props.onFocus();
  }
};

// 👇 Clases CSS dinámicas para el botón
const buttonClasses = computed(() => [
  // Estilos base
  "w-full justify-start text-left font-normal",
  // Variantes
  {
    "border-red-500 focus:border-red-500 focus:ring-red-500":
      props.variant === "error",
    "border-green-500 focus:border-green-500 focus:ring-green-500":
      props.variant === "success",
    "border-gray-500 focus:border-gray-700 focus:ring-gray-500":
      props.variant === "default",
  },
  // Tamaños
  {
    "h-8 px-2 text-sm": props.size === "sm",
    "h-10 px-3 text-base": props.size === "md",
    "h-12 px-4 text-lg": props.size === "lg",
  },
  // Estado de placeholder
  {
    "text-muted-foreground": !localValue.value,
  },
]);

// 👇 Exponer métodos
defineExpose({
  validation: computed(() => validation.value),
  isValid: computed(() => validation.value.isValid),
  errorMessage: computed(() => validation.value.errorMessage),
  sanitizedValue: computed(() => validation.value.sanitizedValue),
  formattedValue: computed(() => validation.value.formattedValue),
  focus: () => {
    isOpen.value = true;
    handleFocus();
  },
  blur: () => {
    isOpen.value = false;
    handleBlur();
  },
});
</script>

<template>
  <div class="space-y-1">
    <!-- 👇 Label opcional -->
    <Label v-if="props.label" :for="inputId" class="text-sm font-medium">
      {{ props.label }}
    </Label>

    <!-- 👇 Dialog con Calendar -->
    <Dialog v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button
          :id="inputId"
          ref="dialogRef"
          variant="outline"
          :class="buttonClasses"
          :disabled="props.disabled"
          @blur="handleBlur"
          @focus="handleFocus"
        >
          <span>{{ displayText }}</span>
          <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent class="w-auto p-0">
        <Calendar
          v-model="calendarValue"
          :min-value="minCalendarDate"
          :max-value="maxCalendarDate"
          initial-focus
          @update:model-value="handleDateSelect"
        />
      </DialogContent>
    </Dialog>

    <!-- 👇 Mensaje de validación -->
    <div
      v-if="props.showValidation && validation.errorMessage"
      class="text-sm text-red-500"
    >
      {{ validation.errorMessage }}
    </div>
  </div>
</template>
