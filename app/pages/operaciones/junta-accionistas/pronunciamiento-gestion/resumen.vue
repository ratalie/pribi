<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="pronunciamiento-gestion"
      title-override="Pronunciamiento sobre Gestión · Resumen"
      description="Conclusiones, acuerdos y compromisos derivados del pronunciamiento de gestión."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "dual-panel-layout",
});
</script>
