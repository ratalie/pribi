<template>
  <div class="space-y-2">
    <h1 class="text-3xl font-bold tracking-tight">
      {{ t(titleKey) }}
    </h1>
    <p class="text-sm text-muted-foreground font-mono">
      {{ currentRoute }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useProboI18n } from "~/composables/useProboI18n";

// Props
interface Props {
  titleKey: string;
}

defineProps<Props>();

// Composables
const { t } = useProboI18n();
const route = useRoute();

// Computed
const currentRoute = computed(() => route.path);
</script>
