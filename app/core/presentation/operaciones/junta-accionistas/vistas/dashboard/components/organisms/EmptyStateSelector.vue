<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
    <Crown class="w-16 h-16 mx-auto mb-4" style="color: var(--text-muted)" />
    <h3
      class="text-xl font-semibold mb-2"
      style="
        color: var(--text-primary);
        font-family: var(--font-primary);
      "
    >
      Selecciona una sociedad
    </h3>
    <p
      class="text-sm"
      style="
        color: var(--text-muted);
        font-family: var(--font-secondary);
      "
    >
      Elige una sociedad del selector para ver su dashboard de juntas
    </p>
  </div>
</template>

<script setup lang="ts">
import { Crown } from "lucide-vue-next";
</script>




