<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra el resultado de la votación y observaciones sobre el nombramiento."
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
