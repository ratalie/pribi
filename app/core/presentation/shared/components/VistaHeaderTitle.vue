<template>
  <div>
    <h1
      v-if="title"
      class="t-t1 font-bold mb-1"
      style="color: var(--text-primary); font-family: var(--font-primary)"
    >
      {{ title }}
    </h1>
    <p
      v-if="subtitle"
      class="t-t2"
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




