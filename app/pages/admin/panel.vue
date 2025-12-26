<script setup lang="ts">
import UserManagementManager from '~/core/presentation/panel-administrativo/vistas/gestion-usuarios/components/UserManagementManager.vue';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Panel Administrativo - PROBO',
});
</script>

<template>
  <UserManagementManager />
</template>

