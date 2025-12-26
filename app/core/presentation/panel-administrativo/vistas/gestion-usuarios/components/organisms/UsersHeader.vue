<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
}

withDefaults(defineProps<Props>(), {
  title: "Gestión de Usuarios",
  subtitle: "Administra usuarios, roles y permisos granulares del sistema",
});
</script>

<template>
  <div class="mb-6">
    <h1
      class="text-3xl mb-2"
      :style="{
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)',
        fontWeight: 600,
      }"
    >
      {{ title }}
    </h1>
    <p
      class="text-sm"
      :style="{
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-secondary)',
      }"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

