<template>
  <section id="convocatoria" class="flex flex-col gap-5">
    <TitleH4
      title="Convocatoria"
      subtitle="Gestiona la publicación de la convocatoria, los plazos y la documentación de soporte."
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
