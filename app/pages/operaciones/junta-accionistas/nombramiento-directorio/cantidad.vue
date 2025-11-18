<template>
  <SlotWrapper>
    <TitleH2
      title="Cantidad de Directores"
      subtitle="Establece el número de integrantes del nuevo directorio y sus alternos."
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
