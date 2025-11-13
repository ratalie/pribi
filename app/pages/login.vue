<script setup lang="ts">
definePageMeta({
  layout: false,
});

if (process.client) {
  navigateTo("/auth/login", { replace: true });
}
</script>

<template>
  <div />
</template>

