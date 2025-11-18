<script setup lang="ts">
  import { useField } from "vee-validate";
  import { computed, watch } from "vue";
  import type { ZodTypeAny } from "zod";
  import BaseNumberInput from "../BaseNumberInput.vue";

  interface Props {
    name: string;
    modelValue?: number;
    label?: string;
    placeholder?: string;
    schema: ZodTypeAny;
    isDisabled?: boolean;
    format?: "decimal" | "integer" | "thousands";
    decimals?: number; // 0 = sin decimales, 2 = dos decimales
    decimalFactor?: number; // 100 para 2 decimales
    currency?: "PEN" | "USD" | null; // PEN = S/, USD = $
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    label: "",
    placeholder: "",
    isDisabled: false,
    format: "thousands",
    decimals: 2,
    decimalFactor: 100,
    currency: null,
  });

  const emit = defineEmits<{ (e: "update:modelValue", v: number): void }>();

  const validateValue = (value: number) => {
    const res = props.schema.safeParse(value);
    return res.success ? true : res.error.issues[0]?.message ?? "Valor inválido";
  };

  const { value, errorMessage, meta, setTouched } = useField(props.name, validateValue, {
    initialValue: props.modelValue,
  });

  const handleModelValue = (value: string) => {
    const newValue = value === "" ? 0 : parseFloat(value);
    emit("update:modelValue", newValue);
  };

  // Sincronizar el valor de vee-validate con el modelValue del store
  watch(
    () => props.modelValue,
    (newValue) => {
      const numValue = newValue ?? 0;
      // Solo actualizar si el valor es diferente para evitar bucles infinitos
      if (value.value !== numValue) {
        value.value = numValue;
      }
    },
    { immediate: true, flush: "sync" }
  );

  // También actualizar el store cuando cambia el valor de vee-validate
  watch(value, (newValue) => {
    if (props.modelValue !== newValue) {
      emit("update:modelValue", newValue);
    }
  });

  // Computed para el valor inicial que se pasa a BaseNumberInput
  // Usar props.modelValue directamente ya que es reactivo y viene del store
  const initialValueForInput = computed(() => {
    const currentValue = props.modelValue ?? 0;
    return currentValue.toString();
  });
</script>

<template>
  <div class="flex w-full justify-end flex-col relative">
    <div class="flex flex-col gap-5 w-full">
      <label v-if="label" :for="name" class="t-t2 font-secondary text-gray-800 font-bold">
        {{ label }}
      </label>
      <BaseNumberInput
        :id="name"
        :initial-value="initialValueForInput"
        :variant="errorMessage ? 'error' : 'default'"
        :size="'md'"
        :placeholder="placeholder"
        :is-disabled="isDisabled"
        :format="format"
        :decimals="decimals"
        :decimal-factor="decimalFactor"
        :currency="currency"
        @update:initial-value="handleModelValue"
        @blur="setTouched(true)"
      />
    </div>
    <p v-if="meta.touched || errorMessage" class="t-t2 -bottom-7 pl-2 text-red-600 absolute">
      {{ errorMessage }}
    </p>
  </div>
</template>
