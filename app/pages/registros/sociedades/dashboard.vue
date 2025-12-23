<template>
  <DashboardSociedadesManager />
</template>

<script setup lang="ts">
import DashboardSociedadesManager from "~/core/presentation/registros/sociedades/vistas/dashboard/components/DashboardSociedadesManager.vue";

definePageMeta({
  layout: "registros",
});

useHead({
  title: "Dashboard Sociedades - PROBO",
});
</script>
