<template>
  <SlotWrapper>
    <TitleH2
      title="Aplicación de Resultados"
      subtitle="Define cómo se distribuyen o absorben los resultados del ejercicio."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Utiliza esta introducción como guía y luego completa los apartados de resultados, aplicación y votación desde el panel derecho.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "default",
  });
</script>
