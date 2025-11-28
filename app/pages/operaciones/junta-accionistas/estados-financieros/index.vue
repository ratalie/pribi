<template>
  <SlotWrapper>
    <TitleH2
      title="Estados Financieros"
      subtitle="Administra la presentación, aprobación y votación de los estados financieros."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Utiliza esta introducción para contextualizar el proceso y luego completa las secciones asociadas desde el panel derecho.
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
