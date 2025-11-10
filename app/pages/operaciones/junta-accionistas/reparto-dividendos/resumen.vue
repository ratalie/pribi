<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Reparto de Dividendos · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen del reparto de dividendos aprobado.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se listarán los montos distribuidos, beneficiarios y acuerdos adoptados.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
