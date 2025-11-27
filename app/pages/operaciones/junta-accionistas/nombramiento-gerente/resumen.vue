<template>
  <div class="page-container p-8">
    <SummarySectionRenderer
      section-id="nombramiento-gerente"
      title-override="Nombramiento de Gerente · Resumen"
      description="Resumen del perfil del gerente, acuerdos y resultado de la votación."
    />
  </div>
</template>

<script setup lang="ts">
import SummarySectionRenderer from "@/components/juntas/SummarySectionRenderer.vue";

definePageMeta({
  layout: "default",
});
</script>
