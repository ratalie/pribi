<template>
  <div>
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p
      v-if="subtitle"
      class="text-sm text-muted-foreground"
      :class="{
        hidden: variant === 'with-subtitle-spacing',
        'opacity-0': variant === 'without-subtitle-spacing',
      }"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import type { Titles } from "~/types/enums/Titles.enum";

  // No es necesario código script adicional para este caso simple

  interface Props {
    title: string;
    subtitle?: string;
    variant?: Titles;
  }
  withDefaults(defineProps<Props>(), {
    subtitle: "",
    variant: undefined,
  });
</script>
