<template>
  <SlotWrapper>
    <TitleH2
      title="Remoción de Directores"
      subtitle="Coordina la revocatoria de directores y comunica el proceso a la junta."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Consulta esta introducción y continúa con cada sección desde el panel derecho para completar el flujo.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });
</script>
