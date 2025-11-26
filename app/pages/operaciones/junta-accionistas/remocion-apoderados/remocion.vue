<template>
  <SlotWrapper>
    <TitleH2
      title="Selección de Apoderados"
      subtitle="Identifica a los apoderados cuya remoción será evaluada."
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
