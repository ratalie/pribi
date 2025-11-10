<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Nombramiento de Auditores · Resumen</h1>
      <p class="text-sm text-muted-foreground">Resumen del proceso de nombramiento de auditores.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se documentarán los auditores seleccionados, requisitos y resultado de la votación.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});
</script>
