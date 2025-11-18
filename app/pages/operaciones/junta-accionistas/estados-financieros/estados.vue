<template>
  <SlotWrapper>
    <TitleH2
      title="Presentación de Estados"
      subtitle="Presenta los estados financieros y documentos contables a la junta."
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
