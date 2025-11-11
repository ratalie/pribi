<template>
  <SlotWrapper>
    <TitleH2
      title="Reparto de Dividendos"
      subtitle="Coordina el cálculo y la distribución de dividendos aprobados por la junta."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Usa esta introducción para contextualizar el tema y luego completa las secciones de cálculo, distribución y votación desde el panel derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
