<!-- app/components/base/inputs/text/custom/RucInput.vue -->
<script setup lang="ts">
  import { VALIDATION_PATTERNS } from "@/constants/inputs/validation-patterns";
import type { BaseTextInputProps, TextInputValidation } from "@/types/inputs/text";
import { computed, ref, watch } from "vue";
import SearchInput from "../ui/SearchInput.vue";

  interface Props extends BaseTextInputProps {
    modelValue?: string;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    showValidation?: boolean;
    label?: string;
    labelId?: string;
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

  // 👇 Función para extraer caracteres permitidos del regex de RUC
  const getAllowedCharacters = () => {
    // El regex de RUC es /^[0-9]{11}$/, extraemos [0-9]
    const rucPattern = VALIDATION_PATTERNS.RUC;
    const patternString = rucPattern.toString();

    // Extraer la parte de caracteres válidos: [0-9]
    const match = patternString.match(/\[([^\]]+)\]/);
    if (match && match[1]) {
      return match[1]; // Retorna "0-9"
    }

    // Fallback si no se puede extraer
    return "0-9";
  };

  // 👇 Función para filtrar caracteres
  const filterValue = (value: string) => {
    const allowedChars = getAllowedCharacters();
    const filterRegex = new RegExp(`[^${allowedChars}]`, "g");
    return value.replace(filterRegex, "");
  };

  // 👇 Valor local filtrado - se actualiza inmediatamente
  const localValue = ref(filterValue(props.modelValue || ""));

  // 👇 Manejador de keydown para prevenir caracteres no válidos
  const handleKeydown = (event: KeyboardEvent) => {
    const allowedChars = getAllowedCharacters();
    const key = event.key;

    // Permitir teclas de control (backspace, delete, tab, etc.)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    // Permitir teclas de navegación
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ].includes(key)
    ) {
      return;
    }

    // Verificar si la tecla es un carácter permitido
    const allowedRegex = new RegExp(`[${allowedChars}]`);
    if (!allowedRegex.test(key)) {
      event.preventDefault();
    }
  };

  // 👇 Manejador de input con filtrado de caracteres usando el regex
  const handleInput = (value: string) => {
    // Filtrar el valor inmediatamente
    const filteredValue = filterValue(value);

    // Actualizar el valor local
    localValue.value = filteredValue;

    console.log("RUC escrito:", filteredValue);
    emit("input", filteredValue);
    emit("update:modelValue", filteredValue);
  };

  // 👇 Watcher para sincronizar con el prop
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== localValue.value) {
        localValue.value = filterValue(newValue || "");
      }
    }
  );

  // 👇 Estado de validación local
  const validation = ref<TextInputValidation>({
    isValid: true,
    errorMessage: "",
    sanitizedValue: props.modelValue || "",
  });

  // 👇 Manejador de validación
  const handleValidation = (validationResult: TextInputValidation) => {
    validation.value = validationResult;
    emit("validation", validationResult);
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
      :model-value="localValue"
      :label="props.label"
      :label-id="props.labelId"
      :placeholder="props.placeholder"
      :validation-type="props.validationType"
      :show-search-icon="props.showSearchIcon"
      :icon-position="props.iconPosition"
      :show-validation="false"
      @update:model-value="handleInput"
      @input="handleInput"
      @validation="handleValidation"
      @keydown="handleKeydown"
    />

    <!-- 👇 Mensaje de validación con espacio reservado -->
    <div class="min-h-[1.25rem]">
      <div v-if="props.showValidation && validation.errorMessage" class="text-sm text-red-500">
        {{ validation.errorMessage }}
      </div>
    </div>
  </div>
</template>
