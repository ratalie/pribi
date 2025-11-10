<template>
  <section id="mesa-directiva" class="flex flex-col gap-5">
    <TitleH4
      title="Presidente y Secretario de la Junta"
      subtitle="Designación de la mesa directiva y registro de responsabilidades."
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
