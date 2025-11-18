<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="seleccion-agenda"
      title-override="Selección de Agenda · Resumen"
      description="Síntesis de la curaduría de temas y validaciones ejecutadas antes de presentar la agenda a los socios."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "dual-panel-layout",
});
</script>
