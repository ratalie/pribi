<template>
  <div>
    <h1
      v-if="title"
      class="text-xl font-bold mb-0.5"
      style="color: var(--text-primary); font-family: var(--font-primary)"
    >
      {{ title }}
    </h1>
    <p
      v-if="subtitle"
      class="text-sm"
      style="color: var(--text-muted); font-family: var(--font-secondary)"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    /** Título principal */
    title?: string;
    /** Subtítulo/descripción */
    subtitle?: string;
  }

  withDefaults(defineProps<Props>(), {
    title: undefined,
    subtitle: undefined,
  });
</script>




