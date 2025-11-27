<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra el resultado de la votación para la capitalización de créditos."
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
