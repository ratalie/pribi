<template>
  <div>
    <h2 :class="['text-2xl font-bold', titleColor]">{{ title }}</h2>
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
  import { computed } from "vue";
  import type { Titles } from "~/types/enums/Titles.enum";

  interface Props {
    title: string;
    subtitle?: string;
    variant?: Titles;
    titleColor?: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    subtitle: "",
    variant: undefined,
    titleColor: "text-gray-900",
  });

  const titleColor = computed(() => props.titleColor || "text-gray-900");
</script>
