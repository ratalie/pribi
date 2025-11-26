<script setup lang="ts">
import LoginView from "@/components/login/LoginView.vue";

definePageMeta({
  layout: false,
});

useHead({
  title: "Inicia sesión - PROBO",
});
</script>

<template>
  <LoginView />
</template>

