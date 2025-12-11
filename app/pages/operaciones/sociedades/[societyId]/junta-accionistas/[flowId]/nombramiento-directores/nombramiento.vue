<template>
  <SlotWrapper>
    <TitleH2
      title="Designación"
      subtitle="Registra a los directores propuestos y los criterios de selección."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });
</script>
