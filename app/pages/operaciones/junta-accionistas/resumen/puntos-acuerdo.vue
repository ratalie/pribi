<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Resumen · Puntos de Acuerdo</h1>
      <p class="text-sm text-muted-foreground">Detalle de cada acuerdo tratado durante la junta.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Esta sección listará los acuerdos por categoría junto a su estado y observaciones.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
