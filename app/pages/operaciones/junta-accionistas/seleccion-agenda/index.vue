<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Puntos de Agenda"
      subtitle="Selecciona los puntos de agenda que se tratarán en la junta de accionistas."
    />
    <div class="flex flex-col gap-10">
      <div class="flex flex-col gap-5">
        <TitleH4 title="Tipo de Junta" :variant="Titles.WITH_SUBTITLE_SPACING" />
        <BlankContainer />
      </div>
      <div class="flex flex-col gap-5">
        <TitleH4 title="Modalidad de la Junta" :variant="Titles.WITH_SUBTITLE_SPACING" />
        <BlankContainer />
      </div>
      <div class="flex flex-col gap-5">
        <TitleH4 title="Convocatoria" :variant="Titles.WITH_SUBTITLE_SPACING" />
        <BlankContainer />
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import Titles from "~/types/enums/Titles.enum";

  // Página: Selección de Puntos de Agenda
  // Nivel: 0 (Principal)
  // Ruta: /operaciones/junta-accionistas/seleccion-agenda

  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
