<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Pronunciamiento de Gestión · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen del pronunciamiento sobre la gestión social.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se consolidarán los pronunciamientos, observaciones y resultados de la votación.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
