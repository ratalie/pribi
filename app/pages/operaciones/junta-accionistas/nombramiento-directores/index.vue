<template>
  <SlotWrapper>
    <TitleH2
      title="Nombramiento de Directores"
      subtitle="Gestiona la designación y aprobación de los miembros del directorio."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Usa esta introducción como punto de partida y continúa con cada sección desde el panel derecho.
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
