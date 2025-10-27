<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { Calendar } from "@/components/ui/calendar";
  import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
  import type { DateValue } from "@internationalized/date";
  import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date";
  import { useVModel } from "@vueuse/core";
  import clsx from "clsx";
  import { CalendarIcon } from "lucide-vue-next";

  interface Props {
    id: string;
    modelValue: string; // Formato ISO: "YYYY-MM-DD"
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
    placeholder?: string;
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "default",
    size: "md",
    placeholder: "Pick a date",
    disabled: false,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", payload: string): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  // Formatter para mostrar la fecha en formato legible
  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  // Computed para convertir el string ISO a DateValue
  const value = computed<DateValue | undefined>({
    get: () => {
      if (!modelValue.value) return undefined;
      try {
        return parseDate(modelValue.value);
      } catch {
        return undefined;
      }
    },
    set: (val) => {
      if (val) {
        modelValue.value = val.toString();
      } else {
        modelValue.value = "";
      }
    },
  });

  // Texto formateado para mostrar
  const displayText = computed(() => {
    if (!value.value) return props.placeholder;
    try {
      return df.format(value.value.toDate(getLocalTimeZone()));
    } catch {
      return props.placeholder;
    }
  });

  const inputClasses = computed(() =>
    clsx(
      // Estilos base
      "w-full justify-start text-left font-normal !border-gray-500 data-[state=open]:!border-gray-700 data-[state=open]:!border-2 data-[state=open]:!outline-none data-[state=open]:!ring-2 data-[state=open]:!ring-[var(--color-outline-ring)] data-[state=open]:!ring-offset-4",
      // Quitar efectos de hover y focus del botón
      "hover:!font-normal focus:!font-normal active:!font-normal",
      // Placeholder
      !value.value && "text-muted-foreground",
      // Variantes
      props.variant === "error" && "!border-red-500 data-[state=open]:!border-red-500",
      props.variant === "success" && "!border-green-500 data-[state=open]:!border-green-500",
      // Tamaños
      props.size === "sm" && "h-8 px-2 text-sm",
      props.size === "md" && "h-10 px-3 text-sm",
      props.size === "lg" && "h-12 px-4 text-lg"
    )
  );
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        :id="props.id"
        variant="outline"
        :class="inputClasses"
        :disabled="props.disabled"
        v-on="$attrs"
      >
        {{ displayText }}
        <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="value" initial-focus />
    </PopoverContent>
  </Popover>
</template>
