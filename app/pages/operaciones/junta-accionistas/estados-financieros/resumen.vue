<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="estados-financieros"
      title-override="Estados Financieros · Resumen"
      description="Resumen de la presentación, aprobación y acuerdos derivados de los estados financieros."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "default",
});
</script>
