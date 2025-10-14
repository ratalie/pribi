<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <NuxtRouteAnnouncer />
</template>

<script setup lang="ts">
// Inicializar tema globalmente
const { currentTheme, effectiveTheme } = useTheme();

// Log de debug para verificar inicialización
onMounted(() => {
  console.log("🚀 App mounted");
  console.log("Current theme:", currentTheme.value);
  console.log("Effective theme:", effectiveTheme.value);
});
</script>
