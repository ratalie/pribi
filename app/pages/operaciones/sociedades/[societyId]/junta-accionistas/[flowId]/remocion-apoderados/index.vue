<template>
  <SlotWrapper>
    <TitleH2
      title="Remoción de Apoderados"
      subtitle="Gestiona la revocatoria de poderes e informa a la junta sobre la decisión."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Utiliza esta introducción como punto de partida y continúa con cada apartado específico
        desde el panel derecho.
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
