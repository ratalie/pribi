<template>
  <DashboardJuntasManager />
</template>

<script setup lang="ts">
import DashboardJuntasManager from "~/core/presentation/operaciones/junta-accionistas/vistas/dashboard/components/DashboardJuntasManager.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Dashboard Junta de Accionistas - PROBO",
});
</script>
