<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Nombramiento de Gerente General · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen del nombramiento del gerente general.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se indicará el gerente designado, condiciones del cargo y el resultado de la votación.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
