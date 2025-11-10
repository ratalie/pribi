<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Resumen · Votaciones</h1>
      <p class="text-sm text-muted-foreground">Resultados detallados de cada votación realizada.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se mostrarán las votaciones con sus quórums, porcentajes y asistentes involucrados.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
