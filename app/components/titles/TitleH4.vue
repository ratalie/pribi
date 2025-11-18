<template>
  <div>
    <h2 class="text-xl font-bold">{{ title }}</h2>
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
  import { Titles } from "~/types/enums/Titles.enum";

  // No es necesario código script adicional para este caso simple

  interface Props {
    title: string;
    subtitle?: string;
    variant?: Titles;
  }
  withDefaults(defineProps<Props>(), {
    subtitle: "",
    variant: Titles.DEFAULT,
  });
</script>
