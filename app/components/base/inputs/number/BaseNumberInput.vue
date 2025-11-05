<script setup lang="ts">
  import clsx from "clsx";

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

  const getNumber = (value: string): string => {
    const newValue = value.replace(/(?!^)-|[^0-9-]/g, "");

    if (props.format === "decimal") {
      const numberFormat = (Number(newValue) / props.decimalFactor).toFixed(props.decimals);
      return numberFormat.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if (props.format === "integer") {
      const parsedInt = parseInt(newValue, 10);
      return isNaN(parsedInt) ? "" : parsedInt.toString();
    }

    if (props.format === "thousands") {
      return newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return newValue;
  };

  const formatValue = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    target.value = getNumber(target.value);
    valueInput.value = target.value;
  };

  watch(valueInput, (newValue) => {
    const valueNumber = newValue.replace(/,/g, "");
    emits("update:initialValue", valueNumber);
  });

  watch(
    () => props.initialValue,
    (newValue) => {
      if (newValue === "" || newValue === null) {
        valueInput.value = "";
      } else if (newValue) {
        let formattedValue = newValue;

        // Solo agregar ceros faltantes si es formato decimal
        if (props.format === "decimal" && props.decimals > 0) {
          if (newValue.includes(".")) {
            // Ya tiene punto, rellenar decimales faltantes
            const [intPart, decPart] = newValue.split(".");
            const paddedDec = (decPart || "").padEnd(props.decimals, "0");
            formattedValue = `${intPart}.${paddedDec}`;
          } else {
            // No tiene punto, agregarlo con ceros
            formattedValue = newValue + "." + "0".repeat(props.decimals);
          }
        }

        valueInput.value = getNumber(formattedValue);
      }
    },
    { immediate: true }
  );

  // Manejar blur
  const handleBlur = () => {
    emits("blur");
  };

  // Clases del input
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
