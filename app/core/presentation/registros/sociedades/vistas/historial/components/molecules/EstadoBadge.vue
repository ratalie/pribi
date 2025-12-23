<template>
  <div class="flex justify-start items-center">
    <span
      :class="[
        'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium',
        estado.isComplete
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      ]"
      style="font-family: var(--font-secondary)"
    >
      <CheckCircle2
        v-if="estado.isComplete"
        class="w-3.5 h-3.5"
      />
      <Clock
        v-else
        class="w-3.5 h-3.5"
      />
      {{ estado.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, Clock } from "lucide-vue-next";
import type { EstadoSociedad } from "../../types/historial.types";

interface Props {
  estado: EstadoSociedad;
}

defineProps<Props>();
</script>

