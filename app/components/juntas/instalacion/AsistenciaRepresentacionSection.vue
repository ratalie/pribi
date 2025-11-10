<template>
  <section id="asistencia-representacion" class="flex flex-col gap-5">
    <TitleH4
      title="Asistencia y Representación de los Accionistas"
      subtitle="Registro de asistentes, poderes otorgados y verificación del quórum."
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />
    <BlankContainer />
  </section>
</template>

<script setup lang="ts">
import TitleH4 from "~/components/titles/TitleH4.vue";
import BlankContainer from "~/components/containers/BlankContainer.vue";
import Titles from "~/types/enums/Titles.enum";
</script>
