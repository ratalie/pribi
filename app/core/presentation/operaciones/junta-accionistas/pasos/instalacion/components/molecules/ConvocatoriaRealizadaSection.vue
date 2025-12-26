<template>
  <section id="convocatoria-realizada" class="flex flex-col gap-5">
    <TitleH4
      title="Convocatoria Realizada"
      subtitle="Detalle de la convocatoria emitida, medios utilizados y plazos cumplidos."
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />
    <BlankContainer />
  </section>
</template>

<script setup lang="ts">
  import BlankContainer from "~/components/containers/BlankContainer.vue";
  import TitleH4 from "~/components/titles/TitleH4.vue";
  import Titles from "~/types/enums/Titles.enum";
</script>





