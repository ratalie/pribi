<template>
  <SlotWrapper>
    <TitleH2
      title="Remoción de Gerente"
      subtitle="Coordina el proceso de remoción del gerente general y comunica los acuerdos correspondientes."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Revisa esta introducción y luego avanza por los apartados de selección, revocatoria y votación desde el panel derecho.
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
