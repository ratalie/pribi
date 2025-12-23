<template>
  <Button
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :class="['flex items-center justify-center', buttonClass]"
    @click="$emit('click')"
  >
    <component v-if="icon" :is="icon" :class="iconClass" />
    <span v-if="label" :class="labelClass">{{ label }}</span>
  </Button>
</template>

<script setup lang="ts">
  import { Button, type ButtonVariants } from "@/components/ui/button";

  interface Props {
    /** Variante del botón */
    variant?: ButtonVariants["variant"];
    /** Tamaño del botón */
    size?: ButtonVariants["size"];
    /** Etiqueta del botón */
    label?: string;
    /** Icono del botón (componente de lucide-vue-next) */
    icon?: any;
    /** Clases adicionales para el botón */
    buttonClass?: string;
    /** Clases para el icono */
    iconClass?: string;
    /** Clases para el label */
    labelClass?: string;
    /** Si el botón está deshabilitado */
    disabled?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    variant: "primary",
    size: "md",
    label: undefined,
    icon: undefined,
    buttonClass: "",
    iconClass: "h-4 w-4",
    labelClass: "",
    disabled: false,
  });

  defineEmits<{
    click: [];
  }>();
</script>




