<template>
  <section id="tipo-junta" class="flex flex-col gap-5">
    <TitleH4
      title="Tipo de Junta"
      subtitle="Define si la junta es ordinaria, extraordinaria u otra modalidad prevista en el estatuto."
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
