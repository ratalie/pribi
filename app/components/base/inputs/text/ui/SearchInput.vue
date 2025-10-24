<!-- app/components/base/inputs/text/ui/SearchInput.vue -->
<script setup lang="ts">
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import type { BaseTextInputProps, TextInputValidation } from "@/types/inputs/text";
  import { validateTextInput } from "@/utils/inputs/validation-rules";
  import { Search } from "lucide-vue-next";
  import { computed, ref, watch } from "vue";

  interface Props extends BaseTextInputProps {
    modelValue?: string;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    showValidation?: boolean;
    label?: string;
    labelId?: string;
    showSearchIcon?: boolean;
    iconPosition?: "left" | "right";
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    variant: "default",
    size: "md",
    showValidation: true,
    label: "",
    labelId: "",
    showSearchIcon: true,
    iconPosition: "left",
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

  // 👇 Flag para evitar bucles infinitos
  let isUpdating = false;

  // 👇 Watcher para sincronizar, validar y consolear
  watch(localValue, (newValue) => {
    if (isUpdating) return; // Evitar bucle infinito

    console.log("Escribiste:", newValue);

    // Validar el input si hay validationType
    if (props.validationType) {
      const validationResult = validateInput(newValue);

      // Si el valor fue filtrado, actualizar localValue
      if (validationResult.sanitizedValue !== newValue) {
        isUpdating = true;
        localValue.value = validationResult.sanitizedValue;
        isUpdating = false;
        return; // Salir para evitar bucle infinito
      }

      emit("update:modelValue", validationResult.sanitizedValue);
      emit("input", validationResult.sanitizedValue);
    } else {
      emit("update:modelValue", newValue);
      emit("input", newValue);
    }
  });

  // 👇 Watcher para sincronizar desde el padre
  watch(
    () => props.modelValue,
    (newValue) => {
      if (isUpdating) return; // Evitar bucle infinito
      localValue.value = newValue || "";
    }
  );

  // 👇 Generar ID único para el input si no se proporciona
  const inputId = computed(
    () => props.labelId || `search-input-${Math.random().toString(36).substr(2, 9)}`
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
    "!border-gray-500 focus:!border-gray-700 focus:!border-2 focus:!outline-none focus:!ring-2 focus:!ring-[var(--color-outline-ring)] focus:!ring-offset-4 w-full",
    // Variantes
    {
      "border-red-500 focus:border-red-500 focus:ring-red-500": props.variant === "error",
      "border-green-500 focus:border-green-500 focus:ring-green-500":
        props.variant === "success",
      // 'default' usa los estilos personalizados de arriba
    },
    // Tamaños
    {
      "h-8 px-2 text-sm": props.size === "sm",
      "h-9 px-3 text-base": props.size === "md",
      "h-10 px-4 text-lg": props.size === "lg",
    },
    // Padding para el ícono
    {
      "pl-10": props.showSearchIcon && props.iconPosition === "left",
      "pr-10": props.showSearchIcon && props.iconPosition === "right",
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
  <div class="space-y-1 w-full">
    <!-- 👇 Label opcional -->
    <Label v-if="props.label" :for="inputId" class="text-sm font-medium">
      {{ props.label }}
    </Label>

    <!-- 👇 Contenedor del input con ícono -->
    <div class="w-full items-center rounded-lg">
      <!-- 👇 Input de búsqueda -->
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

        <!-- 👇 Ícono de búsqueda (izquierda) -->
        <div
          v-if="props.showSearchIcon && props.iconPosition === 'left'"
          class="absolute left-0 inset-y-0 flex items-center justify-center px-3 bg-gray-900 rounded-r-lg cursor-pointer pointer-events-none"
        >
          <Search :size="16" class="text-white" />
        </div>

        <!-- 👇 Ícono de búsqueda (derecha) -->
        <div
          v-if="props.showSearchIcon && props.iconPosition === 'right'"
          class="absolute right-0 inset-y-0 flex items-center justify-center px-3 bg-gray-900 rounded-r-lg cursor-pointer pointer-events-none"
        >
          <Search :size="16" class="text-white" />
        </div>
      </div>
    </div>

    <!-- Mensaje de validación -->
    <div v-if="props.showValidation && validation.errorMessage" class="text-sm text-red-500">
      {{ validation.errorMessage }}
    </div>
  </div>
</template>
