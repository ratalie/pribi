<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="remocion-directores"
      title-override="Remoción de Directores · Resumen"
      description="Resumen de directores removidos, motivos documentados y resultado de la votación."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "default",
});
</script>
