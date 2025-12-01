<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="nombramiento-directores"
      title-override="Nombramiento de Directores · Resumen"
      description="Panorama general de los directores designados, evaluaciones y votación."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "default",
});
</script>
