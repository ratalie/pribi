<template>
  <SlotWrapper>
    <TitleH2
      title="Designación"
      subtitle="Registra los apoderados propuestos y su información clave."
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
