<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <NuxtRouteAnnouncer />
</template>

<script setup lang="ts">
// Inicializar tema globalmente
useTheme();

useHead({
  link: [
    // Preconnect para optimización de carga de fuentes
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "",
    },
    // Importar las 4 fuentes de tu sistema tipográfico
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Gabarito:wght@400..900&family=Manrope:wght@200..800&family=Fira+Code:wght@300..700&display=swap",
    },
  ],
});
</script>
