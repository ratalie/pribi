<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Nombramiento de Apoderados · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen del nombramiento y otorgamiento de poderes.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se incluirán los apoderados designados, poderes otorgados y resultados de la votación.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
