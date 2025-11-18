<template>
  <SlotWrapper>
    <TitleH2
      title="Capitalización de Créditos"
      subtitle="Prepara la información general antes de registrar acreedores, créditos y la votación del acuerdo."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Este módulo concentra todo el proceso para convertir créditos en aportes de capital. Revisa esta
        introducción y luego avanza por cada sección específica mediante el panel derecho.
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
