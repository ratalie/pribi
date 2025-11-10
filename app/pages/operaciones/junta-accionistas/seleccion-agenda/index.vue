<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Puntos de Agenda"
      subtitle="Selecciona los puntos de agenda que se tratarán en la junta de accionistas."
    />

    <BlankContainer />
  </SlotWrapper>
</template>

<script setup lang="ts">
  // Página: Selección de Puntos de Agenda
  // Nivel: 0 (Principal)
  // Ruta: /operaciones/junta-accionistas/seleccion-agenda

  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
