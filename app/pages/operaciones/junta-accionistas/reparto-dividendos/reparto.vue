<template>
  <SlotWrapper>
    <TitleH2
      title="Distribución"
      subtitle="Detalla montos, fechas y modalidades del reparto de dividendos."
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
