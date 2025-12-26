<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="aplicacion-resultados"
      title-override="Aplicación de Resultados · Resumen"
      description="Panorama de la distribución, reservas y votación relacionadas con los resultados del ejercicio."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});
</script>
