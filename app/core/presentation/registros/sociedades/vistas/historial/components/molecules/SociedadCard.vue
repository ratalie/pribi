<template>
  <div class="flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style="background-color: var(--primary-100)"
    >
      <Building2 class="w-5 h-5" style="color: var(--primary-700)" />
    </div>
    <div class="flex flex-col">
      <span
        class="font-semibold"
        style="
          color: var(--text-primary);
          font-family: var(--font-primary);
        "
      >
        {{ razonSocial || "Sociedad sin nombre" }}
      </span>
      <span
        v-if="nombreComercial"
        class="text-xs mt-0.5"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        {{ nombreComercial }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building2 } from "lucide-vue-next";

interface Props {
  razonSocial: string;
  nombreComercial?: string;
}

defineProps<Props>();
</script>

