<script setup lang="ts">
  import { computed } from "vue";

  interface Props {
    paddingX?: string;
    paddingY?: string;
    padding?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    width?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    paddingX: "px-10",
    paddingY: "py-12",
    padding: "",
    backgroundColor: "",
    borderColor: "border-gray-100",
    borderRadius: "rounded-xl",
    width: "",
  });

  const styleObject = computed(() => {
    const styles: Record<string, string> = {};

    // Si backgroundColor no es una clase de Tailwind (no empieza con bg-),
    // aplicarlo como style inline
    if (props.backgroundColor && !props.backgroundColor.startsWith("bg-")) {
      styles.backgroundColor = props.backgroundColor;
    }

    // Si width no es una clase de Tailwind (no empieza con w-),
    // aplicarlo como style inline
    if (props.width && !props.width.startsWith("w-")) {
      styles.width = props.width;
    }

    return styles;
  });

  const backgroundColorClass = computed(() => {
    // Si backgroundColor empieza con bg-, es una clase de Tailwind
    if (props.backgroundColor && props.backgroundColor.startsWith("bg-")) {
      return props.backgroundColor;
    }
    return "";
  });

  const widthClass = computed(() => {
    // Si width empieza con w-, es una clase de Tailwind
    if (props.width && props.width.startsWith("w-")) {
      return props.width;
    }
    return "";
  });
</script>

<template>
  <div
    class="h-full border flex flex-col gap-12"
    :class="[
      padding || `${paddingY} ${paddingX}`,
      borderColor,
      borderRadius,
      backgroundColorClass,
      widthClass,
    ]"
    :style="styleObject"
  >
    <slot />
  </div>
</template>
