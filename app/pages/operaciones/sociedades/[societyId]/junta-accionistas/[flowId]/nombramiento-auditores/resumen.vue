<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="nombramiento-auditores"
      title-override="Nombramiento de Auditores · Resumen"
      description="Resumen del proceso: auditores seleccionados, acuerdos y resultado de la votación."
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
