<template>
  <SlotWrapper>
    <TitleH2
      title="Pronunciamiento sobre Gestión"
      subtitle="Organiza la revisión de la gestión social y prepara la documentación correspondiente."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Revisa este resumen introductorio y continúa con los apartados de informe, votación y acta desde el panel derecho.
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
