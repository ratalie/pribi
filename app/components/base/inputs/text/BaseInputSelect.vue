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
