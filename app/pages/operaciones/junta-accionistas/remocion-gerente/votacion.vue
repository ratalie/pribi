<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Documenta la votación de los accionistas sobre la remoción del gerente."
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
