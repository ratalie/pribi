<template>
  <SlotWrapper>
    <TitleH2
      title="Instalación de la Junta"
      subtitle="Proceso de instalación de la junta: convocatoria, asistencia, presidente y secretario."
    />
    <div class="flex flex-col gap-10">
      <div class="flex flex-col gap-5">
        <TitleH4 title="Convocatoria realizada" :variant="Titles.WITH_SUBTITLE_SPACING" />
        <BlankContainer />
      </div>
      <div class="flex flex-col gap-5">
        <TitleH4
          title="Asistencia y representación de los accionistas"
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <BlankContainer />
      </div>
      <div class="flex flex-col gap-5">
        <TitleH4
          title="Presidente y Secretario de la Junta"
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <BlankContainer />
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import Titles from "~/types/enums/Titles.enum";

  // Página: Instalación de la Junta
  // Nivel: 0 (Principal)
  // RightSidebar: Habilitado (convocatoria, asistencia, mesa)
  // Ruta: /operaciones/junta-accionistas/instalacion

  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
