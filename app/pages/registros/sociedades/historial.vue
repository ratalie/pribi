<template>
  <HistorialSociedadesManager />
</template>

<script setup lang="ts">
  import HistorialSociedadesManager from "~/core/presentation/registros/sociedades/vistas/historial/components/HistorialSociedadesManager.vue";

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Historial Sociedades - PROBO",
  });
</script>
