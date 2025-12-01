<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Detalles de la Junta · Paso 1</h1>
      <p class="text-sm text-muted-foreground">Completar datos generales de la junta.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Esta sección contendrá el formulario de datos generales (tipo, modalidad, fecha, lugar...).
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
