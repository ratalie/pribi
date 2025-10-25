<script lang="ts" setup>
  import { Label } from "@/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import type { BaseSelectProps, SelectValidation } from "@/types/inputs/select";
  import { computed, ref, watch } from "vue";

  interface Props extends BaseSelectProps {
    modelValue?: string | number;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    showValidation?: boolean;
    label?: string;
    labelId?: string;
    customClasses?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    variant: "default",
    size: "md",
    showValidation: true,
    label: "",
    labelId: "",
    customClasses: "",
    placeholder: "Selecciona una opción",
    required: false,
    disabled: false,
    options: () => [],
  });

  const emit = defineEmits<{
    "update:modelValue": [value: string | number];
    input: [value: string | number];
    blur: [value: string | number];
    focus: [];
    validation: [validation: SelectValidation];
  }>();

  // 👇 Referencia al Select
  const selectRef = ref();

  // 👇 Valor local reactivo
  const localValue = ref(props.modelValue || "");

  // 👇 Flag para evitar bucles infinitos
  const isUpdating = ref(false);

  // 👇 Watcher para sincronizar y validar
  watch(localValue, (newValue) => {
    if (isUpdating.value) return; // Evitar bucle infinito

    console.log("Select - Valor seleccionado:", newValue);

    // Validar el select
    const validationResult = validateSelect(newValue);

    emit("update:modelValue", newValue);
    emit("input", newValue);
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

  // 👇 Generar ID único para el select si no se proporciona
  const selectId = computed(
    () => props.labelId || `select-${Math.random().toString(36).substr(2, 9)}`
  );

  // 👇 Estado de validación
  const validation = ref<SelectValidation>({
    isValid: true,
    errorMessage: "",
    selectedValue: props.modelValue || "",
  });

  // 👇 Función para validar el select
  const validateSelect = (value: string | number): SelectValidation => {
    const errors: string[] = [];

    // Validación de requerido
    if (props.required && (!value || value === "")) {
      errors.push("Este campo es obligatorio");
    }

    const result = {
      isValid: errors.length === 0,
      errorMessage: errors[0],
      selectedValue: value,
    };

    validation.value = result;
    return result;
  };

  // 👇 Manejadores de eventos
  const handleValueChange = (value: unknown) => {
    if (value !== null && value !== undefined) {
      localValue.value = String(value);
    }
  };

  const handleBlur = () => {
    const validationResult = validateSelect(localValue.value);
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

  // 👇 Clases CSS dinámicas
  const selectClasses = computed(() => [
    // Estilos base
    "w-full",
    // Variantes
    {
      "border-red-500 focus:border-red-500": props.variant === "error",
      "border-green-500 focus:border-green-500": props.variant === "success",
    },
    // Tamaños
    {
      "h-8 text-sm": props.size === "sm",
      "h-9 text-base": props.size === "md",
      "h-10 text-lg": props.size === "lg",
    },
    // Clases personalizadas
    props.customClasses,
  ]);

  // 👇 Exponer métodos
  defineExpose({
    validation: computed(() => validation.value),
    isValid: computed(() => validation.value.isValid),
    errorMessage: computed(() => validation.value.errorMessage),
    selectedValue: computed(() => validation.value.selectedValue),
    focus: () => selectRef.value?.focus(),
    blur: () => selectRef.value?.blur(),
  });
</script>

<template>
  <div class="space-y-1">
    <!-- 👇 Label -->
    <Label v-if="props.label" :for="selectId" class="text-sm font-medium">
      {{ props.label }}
    </Label>

    <!-- 👇 Select -->
    <Select
      ref="selectRef"
      :value="localValue"
      :disabled="props.disabled"
      @update:model-value="handleValueChange"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <SelectTrigger :class="selectClasses">
        <SelectValue :placeholder="props.placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in props.options"
          :key="option.id"
          :value="option.value.toString()"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- 👇 Mensaje de validación con espacio reservado -->
    <div class="min-h-[1.25rem]">
      <div v-if="props.showValidation && validation.errorMessage" class="text-sm text-red-500">
        {{ validation.errorMessage }}
      </div>
    </div>
  </div>
</template>
