<template>
  <SlotWrapper>
    <TitleH2
      title="Nombramiento de Directorio"
      subtitle="Gestiona la conformación y aprobación del directorio completo."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Consulta esta introducción y sigue los pasos detallados desde el panel derecho para completar el proceso.
      </p>
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
