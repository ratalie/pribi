<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import clsx from "clsx";
  import Input from "~/components/ui/input/Input.vue";

  interface Props {
    id: string;
    modelValue: string;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    placeholder?: string;
    type?: string;
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
      "!border-gray-500 focus:!border-gray-700 focus:!border-2 focus:!outline-none focus:!ring-2 focus:!ring-[var(--color-outline-ring)] focus:!ring-offset-4",
      // Variantes
      props.variant === "error" && "!border-red-500 focus:!border-red-500 focus:!ring-red-500",
      props.variant === "success" &&
        "!border-green-500 focus:!border-green-500 focus:!ring-green-500",
      // Tamaños
      props.size === "sm" && "h-8 px-2 text-sm",
      props.size === "md" && "h-10 px-3 text-base",
      props.size === "lg" && "h-12 px-4 text-lg",

      // Deshabilitado
      props.isDisabled &&
        "disabled:!bg-gray-200 disabled:!cursor-not-allowed disabled:!opacity-100"
    )
  );
</script>

<template>
  <Input
    :id="props.id"
    v-model="modelValue"
    :class="inputClasses"
    :placeholder="props.placeholder"
    :type="props.type || 'text'"
    :disabled="props.isDisabled"
    v-on="$attrs"
  />
</template>
