<template>
  <SlotWrapper>
    <TitleH2
      title="Aportes Dinerarios"
      subtitle="Conoce el acuerdo y prepara la documentación previa antes de registrar aportantes, aportes y la votación."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Esta sección reúne toda la información necesaria para los acuerdos de aumento de
        capital vía aporte dinerario. Revisa la descripción general y luego avanza por los
        apartados específicos desde el panel derecho.
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
