<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Nombramiento de Directorio · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen de la conformación del nuevo directorio.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se listarán los integrantes del directorio, periodos y acuerdos relevantes.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
