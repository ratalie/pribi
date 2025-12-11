<template>
  <SlotWrapper>
    <TitleH2
      title="Designación"
      subtitle="Detalla la propuesta de directorio y la validación de requisitos."
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
