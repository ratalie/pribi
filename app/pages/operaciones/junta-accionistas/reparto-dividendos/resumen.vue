<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="reparto-dividendos"
      title-override="Reparto de Dividendos · Resumen"
      description="Resumen del cálculo, distribución y votación vinculados al reparto de dividendos."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "dual-panel-layout",
});
</script>
