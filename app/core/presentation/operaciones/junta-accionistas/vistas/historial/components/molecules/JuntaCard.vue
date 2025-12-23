<template>
  <div class="flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style="background-color: var(--primary-100)"
    >
      <Crown class="w-5 h-5" style="color: var(--primary-700)" />
    </div>
    <div class="flex flex-col">
      <span
        class="font-semibold"
        style="
          color: var(--text-primary);
          font-family: var(--font-primary);
        "
      >
        Junta #{{ id }}
      </span>
      <span
        v-if="actual"
        class="text-xs mt-0.5"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        {{ actual }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Crown } from "lucide-vue-next";

interface Props {
  id: string;
  actual?: string;
}

defineProps<Props>();
</script>




