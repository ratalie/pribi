<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Directores"
      subtitle="Elige a los directores cuyo mandato será sometido a remoción."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "default",
  });
</script>
