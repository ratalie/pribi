<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra la decisión de la junta respecto al gerente propuesto."
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
