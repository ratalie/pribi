<template>
  <SlotWrapper>
    <TitleH2
      title="Otorgamiento de Poderes"
      subtitle="Documenta las facultades delegadas, limitaciones y vigencia de cada apoderado."
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
