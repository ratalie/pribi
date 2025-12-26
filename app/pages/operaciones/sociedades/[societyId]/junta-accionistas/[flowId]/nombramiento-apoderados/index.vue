<template>
  <SlotWrapper>
    <TitleH2
      title="Nombramiento de Apoderados"
      subtitle="Administra la designación, otorgamiento de poderes y votación vinculada a los apoderados."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Revisa la descripción general del proceso y continúa con cada sección específica desde el panel derecho.
      </p>
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
