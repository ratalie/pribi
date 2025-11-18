<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Documenta el resultado de la votación sobre el reparto de dividendos."
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
