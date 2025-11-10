<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Nombramiento de Directores · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen del nombramiento de directores.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se resumirán los directores nombrados, vigencia de sus cargos y aprobación de la junta.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
