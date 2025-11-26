<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra el resultado de la votación sobre la remoción de directores."
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
