<script setup lang="ts">
import UserManagementView from '@/components/admin/UserManagementView.vue';

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Panel Administrativo - PROBO',
});
</script>

<template>
  <UserManagementView />
</template>

