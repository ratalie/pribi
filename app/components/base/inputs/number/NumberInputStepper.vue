<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import clsx from "clsx";
  import { ChevronDown, ChevronUp } from "lucide-vue-next";
  import { computed } from "vue";
  import { useNumberStepper } from "~/composables/useNumberStepper";

  interface Props {
    id: string;
    modelValue: string;
    min?: number;
    max?: number;
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg" | "large";
    placeholder?: string;
    isDisabled?: boolean;
    class?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    min: 3,
    max: 9,
    variant: "default",
    size: "md",
    placeholder: undefined,
    class: undefined,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", payload: string): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  // Lógica extraída al composable
  const {
    inputValue,
    handleInput,
    handleBlur,
    increment,
    decrement,
    canIncrement,
    canDecrement,
  } = useNumberStepper({
    modelValue,
    min: props.min,
    max: props.max,
    isDisabled: props.isDisabled,
    onUpdate: (value) => {
      modelValue.value = value;
    },
  });

  const iconSize = computed(() => {
    switch (props.size) {
      case "sm":
        return "w-3 h-3";
      case "lg":
        return "w-4 h-4";
      case "large":
        return "w-4 h-4";
      default:
        return "w-3 h-3";
    }
  });

  const paddingRight = computed(() => {
    switch (props.size) {
      case "sm":
        return "pr-7";
      case "lg":
        return "pr-10";
      case "large":
        return "pr-10";
      default:
        return "pr-8";
    }
  });

  const inputClasses = computed(() =>
    clsx(
      // Estilos base
      "!border-gray-500 focus:!border-gray-700 focus:!border-2 focus:!outline-none focus:!ring-2 focus:!ring-[var(--color-outline-ring)] focus:!ring-offset-4",
      "rounded-md border bg-transparent pl-3 py-1 text-base shadow-xs",
      "text-gray-700 font-secondary w-full",
      paddingRight.value,
      // Variantes
      props.variant === "error" && "!border-red-500 focus:!border-red-500 focus:!ring-red-500",
      props.variant === "success" &&
        "!border-green-500 focus:!border-green-500 focus:!ring-green-500",
      // Tamaños
      props.size === "sm" && "h-8 text-sm",
      props.size === "md" && "h-10 text-base",
      props.size === "lg" && "h-12 text-lg",
      props.size === "large" && "h-[44px] text-base",

      // Deshabilitado
      props.isDisabled &&
        "disabled:!bg-gray-200 disabled:!cursor-not-allowed disabled:!opacity-100",

      // Clases adicionales
      props.class
    )
  );
</script>

<template>
  <div class="relative" :class="props.size === 'large' ? 'w-full' : 'w-full'">
    <input
      :id="props.id"
      v-model="inputValue"
      type="text"
      inputmode="numeric"
      :class="inputClasses"
      :placeholder="props.placeholder"
      :disabled="props.isDisabled"
      v-on="$attrs"
      @input="handleInput"
      @blur="handleBlur"
    />
    <div
      class="absolute inset-y-0 right-0 flex items-center justify-center pr-2 pointer-events-none z-10"
    >
      <div class="flex flex-col gap-0 pointer-events-auto">
        <button
          type="button"
          tabindex="-1"
          class="p-0 flex items-center justify-center"
          :disabled="props.isDisabled || !canIncrement"
          :class="{
            'opacity-50 cursor-not-allowed': props.isDisabled || !canIncrement,
          }"
          @click="
            () => {
              if (!props.isDisabled) {
                increment();
              }
            }
          "
        >
          <ChevronUp :class="[iconSize, 'text-gray-600']" />
        </button>
        <button
          type="button"
          tabindex="-1"
          class="p-0 flex items-center justify-center"
          :disabled="props.isDisabled || !canDecrement"
          :class="{
            'opacity-50 cursor-not-allowed': props.isDisabled || !canDecrement,
          }"
          @click="
            () => {
              if (!props.isDisabled) {
                decrement();
              }
            }
          "
        >
          <ChevronDown :class="[iconSize, 'text-gray-600']" />
        </button>
      </div>
    </div>
  </div>
</template>
