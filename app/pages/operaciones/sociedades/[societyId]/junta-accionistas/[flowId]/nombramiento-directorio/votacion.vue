<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra la aprobación o rechazo del directorio propuesto."
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
