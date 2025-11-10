<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Aplicación de Resultados · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen del cálculo y distribución de resultados.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se consolidarán los valores calculados, la votación y los acuerdos relacionados con la aplicación de resultados.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
