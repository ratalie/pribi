<template>
  <SlotWrapper>
    <TitleH2
      title="Designación"
      subtitle="Detalla la propuesta de directorio y la validación de requisitos."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import BlankContainer from "~/components/containers/BlankContainer.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });
</script>
