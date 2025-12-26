<template>
  <CrearJuntaManager />
</template>

<script setup lang="ts">
import CrearJuntaManager from "~/core/presentation/operaciones/junta-accionistas/vistas/crear/components/CrearJuntaManager.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Crear Junta de Accionistas - PROBO",
});
</script>
