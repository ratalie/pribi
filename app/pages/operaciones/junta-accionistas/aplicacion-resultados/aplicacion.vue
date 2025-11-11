<template>
  <SlotWrapper>
    <TitleH2
      title="Detalle de Aplicación"
      subtitle="Define la asignación de utilidades o el tratamiento de pérdidas."
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
