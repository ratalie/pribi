<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Resumen · Documentos</h1>
      <p class="text-sm text-muted-foreground">Documentos generados y pendientes de descarga.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se listarán las actas, certificados u otros documentos asociados a la junta.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
