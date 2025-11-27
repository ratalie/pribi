<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="nombramiento-apoderados"
      title-override="Nombramiento de Apoderados · Resumen"
      description="Consolidado de apoderados designados, poderes otorgados y resultado de la votación."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "default",
});
</script>
