<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Resumen General</h1>
      <p class="text-sm text-muted-foreground">Consolidado de la junta y estado global del flujo.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se presentará la visión general de la junta: participación, acuerdos adoptados y principales métricas.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
