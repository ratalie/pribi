<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="detalles"
      title-override="Detalles de la Junta · Resumen"
      description="Consolidado de información operativa: modalidad, horarios, participantes confirmados y documentación soporte."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "dual-panel-layout",
});
</script>
