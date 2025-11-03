<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Selección de Puntos de Agenda</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        Aquí se seleccionarán los puntos de agenda que se tratarán en la junta de accionistas.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Selección de Puntos de Agenda
  // Nivel: 0 (Principal)
  // Ruta: /operaciones/junta-accionistas/seleccion-agenda

  definePageMeta({
    layout: "sidebar-general",
  });
</script>
