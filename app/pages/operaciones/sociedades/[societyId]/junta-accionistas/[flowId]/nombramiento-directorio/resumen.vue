<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="nombramiento-directorio"
      title-override="Nombramiento de Directorio · Resumen"
      description="Resumen de la conformación, acuerdos y votación del directorio propuesto."
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
