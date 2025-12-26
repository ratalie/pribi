<template>
  <section id="modalidad-junta" class="flex flex-col gap-5">
    <TitleH4
      title="Modalidad de la Junta"
      subtitle="Registra si la sesión será presencial, virtual o mixta y las reglas de participación."
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

