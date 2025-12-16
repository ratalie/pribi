<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import clsx from "clsx";
  import { Minus, Plus } from "lucide-vue-next";
  import { computed, ref, watch } from "vue";

  interface Props {
    id: string;
    modelValue: string | number;
    min?: number;
    max?: number;
    isDisabled?: boolean;
    class?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 1000,
    isDisabled: false,
    class: undefined,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", payload: string): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  // Valor interno del input
  const inputValue = ref(String(modelValue.value || 0));

  // Convertir a número de forma segura
  const getNumericValue = (value: string | number | undefined | null): number => {
    if (value === undefined || value === null || value === "") return props.min;
    const num = typeof value === "number" ? value : parseInt(String(value), 10);
    return isNaN(num) ? props.min : num;
  };

  // Asegurar que el valor esté entre min y max
  const clampValue = (value: number): number => {
    return Math.max(props.min, Math.min(props.max, value));
  };

  // Manejar input manual
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const numericValue = target.value.replace(/[^0-9]/g, ""); // Solo números

    if (numericValue === "") {
      inputValue.value = "";
      modelValue.value = String(props.min);
      return;
    }

    const num = parseInt(numericValue, 10);
    if (!isNaN(num)) {
      const clamped = clampValue(num);
      const clampedStr = String(clamped);
      inputValue.value = clampedStr;
      modelValue.value = clampedStr;
    } else {
      inputValue.value = String(getNumericValue(modelValue.value));
    }
  };

  // Manejar blur
  const handleBlur = () => {
    const num = parseInt(inputValue.value, 10);
    if (isNaN(num) || inputValue.value === "") {
      const defaultValue = String(getNumericValue(modelValue.value) || props.min);
      inputValue.value = defaultValue;
      modelValue.value = defaultValue;
    } else {
      const clamped = clampValue(num);
      const clampedStr = String(clamped);
      inputValue.value = clampedStr;
      modelValue.value = clampedStr;
    }
  };

  // Incrementar
  const increment = () => {
    if (props.isDisabled) return;
    const currentNum = getNumericValue(modelValue.value);
    const newValue = clampValue(currentNum + 1);
    const newValueStr = String(newValue);
    modelValue.value = newValueStr;
    inputValue.value = newValueStr;
  };

  // Decrementar
  const decrement = () => {
    if (props.isDisabled) return;
    const currentNum = getNumericValue(modelValue.value);
    const newValue = clampValue(currentNum - 1);
    const newValueStr = String(newValue);
    modelValue.value = newValueStr;
    inputValue.value = newValueStr;
  };

  // Verificar si se puede incrementar
  const canIncrement = computed(() => {
    const currentNum = getNumericValue(modelValue.value);
    return !props.isDisabled && currentNum < props.max;
  });

  // Verificar si se puede decrementar
  const canDecrement = computed(() => {
    const currentNum = getNumericValue(modelValue.value);
    return !props.isDisabled && currentNum > props.min;
  });

  // Sincronizar cuando cambia el modelValue desde fuera
  watch(
    () => modelValue.value,
    (newValue) => {
      if (newValue !== undefined && newValue !== null && newValue !== "") {
        inputValue.value = String(newValue);
      } else if (!inputValue.value) {
        inputValue.value = String(props.min);
      }
    },
    { immediate: true }
  );

  const inputClasses = computed(() =>
    clsx(
      "border border-gray-100 bg-white text-gray-700 rounded-md",
      "w-full min-w-32 px-3 py-2 text-base font-secondary",
      "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-600",
      props.isDisabled && "opacity-50 cursor-not-allowed",
      props.class
    )
  );
</script>

<template>
  <div class="relative w-full">
    <input
      :id="props.id"
      v-model="inputValue"
      type="text"
      inputmode="numeric"
      :class="inputClasses"
      :disabled="props.isDisabled"
      v-on="$attrs"
      @input="handleInput"
      @blur="handleBlur"
    />
    <div
      class="absolute inset-y-0 right-0 flex items-center pr-2 gap-1 pointer-events-none z-10"
    >
      <div class="flex items-center gap-1 pointer-events-auto">
        <button
          type="button"
          tabindex="-1"
          class="p-1 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
          :disabled="!canDecrement"
          :class="{ 'opacity-50 cursor-not-allowed': !canDecrement }"
          @click="decrement"
        >
          <Minus class="w-4 h-4 text-gray-700" />
        </button>
        <div class="w-px h-4 bg-gray-400"></div>
        <button
          type="button"
          tabindex="-1"
          class="p-1 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
          :disabled="!canIncrement"
          :class="{ 'opacity-50 cursor-not-allowed': !canIncrement }"
          @click="increment"
        >
          <Plus class="w-4 h-4 text-gray-700" />
        </button>
      </div>
    </div>
  </div>
</template>
