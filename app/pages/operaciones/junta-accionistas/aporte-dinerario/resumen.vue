<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="aporte-dinerario"
      title-override="Aporte Dinerario · Resumen"
      description="Indicadores finales del proceso de aporte dinerario: aportantes registrados, montos comprometidos y actas generadas."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "dual-panel-layout",
});
</script>