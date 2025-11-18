<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Detalles de la Junta · Paso 2</h1>
      <p class="text-sm text-muted-foreground">Gestionar participantes, representación y quórum.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se registrarán los accionistas, representantes y documentos de respaldo.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
