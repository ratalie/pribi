<template>
  <div class="flex items-center gap-3">
    <div class="flex flex-col">
      <span
        class="font-semibold"
        style="color: var(--text-primary); font-family: var(--font-primary)"
      >
        {{ razonSocial || "Sociedad sin nombre" }}
      </span>
      <span
        v-if="nombreComercial"
        class="text-xs mt-0.5"
        style="color: var(--text-muted); font-family: var(--font-secondary)"
      >
        {{ nombreComercial }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    razonSocial: string;
    nombreComercial?: string;
  }

  defineProps<Props>();
</script>
