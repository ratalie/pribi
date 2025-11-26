<template>
  <SlotWrapper>
    <TitleH2
      title="Nombramiento de Auditores"
      subtitle="Gestiona la designación y aprobación de los auditores externos."
    />

    <div class="flex flex-col gap-8">
      <p class="text-sm text-muted-foreground">
        Utiliza esta sección como introducción y avanza por las etapas específicas con el panel derecho.
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
