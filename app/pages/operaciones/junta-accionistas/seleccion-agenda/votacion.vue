<template>
  <div class="page-container p-6 space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Selección de Agenda · Votación</h1>
      <p class="text-sm text-muted-foreground">Registrar la votación sobre la agenda propuesta.</p>
    </header>

    <section class="card p-4 border rounded-md bg-white shadow-sm">
      <p class="text-gray-600">
        Aquí se gestionan los votos y el resultado de la aprobación de la agenda.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
