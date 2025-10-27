<script setup lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import type { SelectOption } from "@/types/inputs/select";
  import { useVModel } from "@vueuse/core";
  import clsx from "clsx";

  interface Props {
    id: string;
    modelValue: string;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    placeholder?: string;
    customClasses?: string;
    options?: SelectOption[];
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
      // Usar data-state para cuando el select está abierto (reka-ui usa data-state)
      "data-[state=open]:!border-gray-700 data-[state=open]:!border-2",
      "data-[state=open]:!ring-2 data-[state=open]:!ring-[var(--color-outline-ring)] data-[state=open]:!ring-offset-4",
      // Variantes
      {
        "!border-red-500 data-[state=open]:!border-red-500 data-[state=open]:!ring-red-500":
          props.variant === "error",
        "!border-green-500 data-[state=open]:!border-green-500 data-[state=open]:!ring-green-500":
          props.variant === "success",
      },
      // Tamaños
      {
        "h-8 text-sm": props.size === "sm",
        "!h-[40px] text-sm": props.size === "md",
        "h-10 text-lg": props.size === "lg",
      },
      // Clases personalizadas
      props.customClasses
    )
  );
</script>

<template>
  <Select :id="props.id" v-model="modelValue" v-on="$attrs">
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
