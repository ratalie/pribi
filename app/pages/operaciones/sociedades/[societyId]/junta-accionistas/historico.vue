<template>
  <HistorialJuntasManager />
</template>

<script setup lang="ts">
import HistorialJuntasManager from "~/core/presentation/operaciones/junta-accionistas/vistas/historial/components/HistorialJuntasManager.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Histórico Juntas - PROBO",
});
</script>
