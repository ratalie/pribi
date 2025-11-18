<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra la aprobación de la aplicación de resultados por parte de los accionistas."
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
