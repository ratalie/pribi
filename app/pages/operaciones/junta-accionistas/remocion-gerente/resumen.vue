<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="remocion-gerente"
      title-override="Remoción de Gerente · Resumen"
      description="Resumen del gerente removido, fundamentos y resultado de la votación."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "dual-panel-layout",
});
</script>
