<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="remocion-apoderados"
      title-override="Remoción de Apoderados · Resumen"
      description="Consolidado de apoderados removidos, motivos y resultado de la votación."
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
