<script setup lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { useVModel } from "@vueuse/core";
  import clsx from "clsx";

  export interface BaseSelectOption {
    id: string | number;
    value: string | number;
    label: string;
  }

  interface Props<T extends BaseSelectOption = BaseSelectOption> {
    id: string;
    modelValue: string;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    placeholder?: string;
    customClasses?: string;
    options?: T[];
    isDisabled?: boolean;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", payload: string | number): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const inputClasses = computed(() =>
    clsx(
      // Estilos base
      "w-full !border-gray-500",
      "data-[state=open]:!border-gray-700 data-[state=open]:!border-2",
      "data-[state=open]:!ring-2 data-[state=open]:!ring-[var(--color-outline-ring)] data-[state=open]:!ring-offset-4",
      // Estilos para el valor seleccionado (cuando NO es placeholder)
      "*:data-[slot=select-value]:font-secondary *:data-[slot=select-value]:text-gray-700",

      // Variantes
      props.variant === "error" &&
        "!border-red-500 data-[state=open]:!border-red-500 data-[state=open]:!ring-red-500",
      props.variant === "success" &&
        "!border-green-500 data-[state=open]:!border-green-500 data-[state=open]:!ring-green-500",

      // Tamaños
      props.size === "sm" && "h-8 text-sm",
      props.size === "md" && "!h-[40px] text-sm",
      props.size === "lg" && "h-10 text-lg",

      // Deshabilitado
      props.customClasses,
      props.isDisabled &&
        "disabled:!bg-gray-200 disabled:!cursor-not-allowed disabled:!opacity-100"
    )
  );
</script>

<template>
  <Select :id="props.id" v-model="modelValue" :disabled="props.isDisabled" v-on="$attrs">
    <SelectTrigger :class="inputClasses">
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
</template>
