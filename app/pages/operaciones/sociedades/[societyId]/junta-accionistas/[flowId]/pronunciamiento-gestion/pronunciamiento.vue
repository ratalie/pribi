<template>
  <SlotWrapper>
    <TitleH2
      title="Informe de Gestión"
      subtitle="Recopila observaciones, hallazgos y conclusiones sobre la gestión presentada."
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
