<template>
  <AgregarSociedadManager />
</template>

<script setup lang="ts">
import AgregarSociedadManager from "~/core/presentation/registros/sociedades/vistas/agregar/components/AgregarSociedadManager.vue";

definePageMeta({
  layout: "registros",
});

useHead({
  title: "Agregar Sociedad - PROBO",
});
</script>
