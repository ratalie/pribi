<template>
  <SlotWrapper>
    <TitleH2
      title="Nombramiento de Gerente"
      subtitle="Administra la propuesta y aprobación del gerente general."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Usa esta vista introductoria para contextualizar el proceso antes de avanzar por las secciones detalladas.
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
