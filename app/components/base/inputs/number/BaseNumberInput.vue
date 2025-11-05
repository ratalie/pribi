<script setup lang="ts">
  import clsx from "clsx";
  import { useNumberFormatter } from "~/composables/useNumberFormatter";

  interface Props {
    id: string;
    initialValue?: string;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    placeholder?: string;
    customClasses?: string;
    isDisabled?: boolean;
    format?: "decimal" | "integer" | "thousands";
    decimals?: number; // 0 = sin decimales, 2 = dos decimales
    decimalFactor?: number; // 100 para 2 decimales
  }

  const props = withDefaults(defineProps<Props>(), {
    initialValue: "",
    variant: "default",
    size: "md",
    placeholder: "",
    customClasses: "",
    isDisabled: false,
    decimals: 2,
    format: "thousands",
    decimalFactor: 100,
  });

  const emits = defineEmits<{
    (e: "update:initialValue", payload: string): void;
    (e: "blur"): void;
  }>();

  const valueInput = ref(props.initialValue);

  const { formatNumber, unformatNumber, padDecimals } = useNumberFormatter({
    decimals: props.decimals,
    decimalFactor: props.decimalFactor,
    format: props.format,
  });

  const formatValue = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    target.value = formatNumber(target.value);
    valueInput.value = target.value;
  };

  watch(valueInput, (newValue) => {
    const valueNumber = unformatNumber(newValue);
    emits("update:initialValue", valueNumber.toString());
  });

  watch(
    () => props.initialValue,
    (newValue) => {
      if (newValue === "" || newValue === null) {
        valueInput.value = "";
      } else if (newValue) {
        // Completar decimales faltantes si es necesario
        const paddedValue = padDecimals(newValue);
        // Formatear el valor con comas y decimales
        valueInput.value = formatNumber(paddedValue);
      }
    },
    { immediate: true }
  );

  const handleBlur = () => {
    emits("blur");
  };

  const inputClasses = computed(() =>
    clsx(
      // Estilos base
      "w-full !border-gray-500 bg-background",
      "rounded-md border px-3 py-2 text-sm font-secondary",
      "focus:outline-none focus:ring-2 focus:ring-[var(--color-outline-ring)] focus:ring-offset-4",
      "transition-colors",

      // Variantes
      props.variant === "error" && "!border-red-500 focus:!border-red-500 focus:!ring-red-500",
      props.variant === "success" &&
        "!border-green-500 focus:!border-green-500 focus:!ring-green-500",

      // Tamaños
      props.size === "sm" && "h-8 text-xs",
      props.size === "md" && "!h-[40px] text-sm",
      props.size === "lg" && "h-12 text-base",

      // Deshabilitado
      props.isDisabled &&
        "disabled:!bg-gray-200 disabled:!cursor-not-allowed disabled:!opacity-100",

      props.customClasses
    )
  );
</script>

<template>
  <input
    :id="props.id"
    type="text"
    :value="valueInput"
    :placeholder="props.placeholder"
    :disabled="props.isDisabled"
    :class="inputClasses"
    @input="formatValue"
    @blur="handleBlur"
    v-on="$attrs"
  />
</template>
