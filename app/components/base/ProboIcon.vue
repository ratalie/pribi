<script setup lang="ts">
  import { getIcon } from "~/utils/iconMapper";

  interface Props {
    /**
     * Nombre del icono Lucide
     * Ejemplos: "Users", "Settings", "Check", etc.
     */
    name: string;
    iconClass?: string;
    size?: string;
  }

  const props = defineProps<Props>();

  const icon = getIcon(props.name);
</script>

<template>
  <component
    v-if="icon"
    :is="icon"
    :class="iconClass"
    :style="size ? { width: size, height: size } : undefined"
  />
</template>
