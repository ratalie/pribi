<template>
  <SlotWrapper>
    <TitleH2
      title="Cantidad de Directores"
      subtitle="Define la conformación del directorio: número de titulares y suplentes."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
