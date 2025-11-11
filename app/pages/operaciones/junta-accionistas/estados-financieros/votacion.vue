<template>
  <SlotWrapper>
    <TitleH2
      title="Votación"
      subtitle="Registra la aprobación o desaprobación de los estados financieros."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
