<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="instalacion"
      title-override="Instalación de la Junta · Resumen"
      description="Acta de instalación, verificación de quórum y designación de la mesa directiva reunidos en un solo lugar."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "default",
});
</script>
