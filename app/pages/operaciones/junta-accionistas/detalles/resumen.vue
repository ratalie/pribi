<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="detalles"
      title-override="Detalles de la Junta · Resumen"
      description="Consolidado de las decisiones registradas sobre tipo, modalidad y convocatoria de la junta."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "default",
});
</script>
