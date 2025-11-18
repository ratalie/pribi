<script setup lang="ts">
  import clsx from "clsx";
  import { computed, ref, watch } from "vue";
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
    currency?: "PEN" | "USD" | null; // PEN = S/, USD = $
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
    currency: null,
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
      if (newValue === "" || newValue === null || newValue === undefined) {
        valueInput.value = "";
      } else if (newValue) {
        // Completar decimales faltantes si es necesario
        const paddedValue = padDecimals(newValue);
        // Formatear el valor con comas y decimales
        const formattedValue = formatNumber(paddedValue);
        valueInput.value = formattedValue;
      }
    },
    { immediate: true }
  );

  const handleBlur = () => {
    emits("blur");
  };

  const currencySymbol = computed(() => {
    if (!props.currency) return null;
    return props.currency === "PEN" ? "S/" : "$";
  });

  const currencySymbolClasses = computed(() =>
    clsx(
      "font-secondary font-bold text-gray-700 shrink-0",
      // Tamaños de texto según el size del input
      props.size === "sm" && "t-b2",
      props.size === "md" && "t-t2",
      props.size === "lg" && "t-t1"
    )
  );

  const containerClasses = computed(() =>
    clsx(
      "relative flex items-center gap-[5px]",
      "border border-gray-500 rounded-md bg-background",
      "focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-outline-ring)] focus-within:ring-offset-4",
      "transition-colors",
      // Variantes del borde
      props.variant === "error" && "!border-red-500 focus-within:!ring-red-500",
      props.variant === "success" && "!border-green-500 focus-within:!ring-green-500",
      // Tamaños del contenedor
      props.size === "sm" && "h-8 px-2",
      props.size === "md" && "h-10 px-3",
      props.size === "lg" && "h-12 px-4",
      // Deshabilitado
      props.isDisabled && "!bg-gray-200 cursor-not-allowed"
    )
  );

  const inputClasses = computed(() =>
    clsx(
      "w-full border-none bg-transparent outline-none focus:outline-none focus:ring-0",
      "p-0 font-secondary",
      // Tamaños de texto
      props.size === "sm" && "t-b2",
      props.size === "md" && "t-t2",
      props.size === "lg" && "t-t1",
      // Deshabilitado
      props.isDisabled && "cursor-not-allowed",
      props.customClasses
    )
  );
</script>

<template>
  <div :class="containerClasses">
    <!-- Símbolo de moneda (condicional) -->
    <span v-if="props.currency" :class="currencySymbolClasses">
      {{ currencySymbol }}
    </span>

    <!-- Input único -->
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
  </div>
</template>
