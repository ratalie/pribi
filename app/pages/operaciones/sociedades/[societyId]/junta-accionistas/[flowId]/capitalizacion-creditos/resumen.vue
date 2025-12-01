<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="capitalizacion-creditos"
      title-override="Capitalización de Créditos · Resumen"
      description="Panorama general de los acreedores, créditos y resultado de la votación registrados."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "default",
});
</script>
