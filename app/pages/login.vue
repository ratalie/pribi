<script setup lang="ts">
definePageMeta({
  layout: false,
});

if (import.meta.client) {
  navigateTo("/auth/login", { replace: true });
}
</script>

<template>
  <div />
</template>

