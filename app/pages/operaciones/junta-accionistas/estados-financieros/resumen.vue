<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Estados Financieros · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen de la revisión de estados financieros.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se detallarán los estados presentados, resultados de la votación y notas relevantes.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
