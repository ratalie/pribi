<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Descargar Documentos</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        Descarga de actas y documentos generados de la junta.
      </p>
      <p class="text-xs text-blue-500 mt-2">
        📌 Esta página tiene rightSidebar con lista de actas disponibles
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Descargar
  // Nivel: 0 (Principal)
  // RightSidebar: Habilitado (lista de actas)
  // Ruta: /operaciones/junta-accionistas/descargar

  definePageMeta({
    layout: "default",
  });
</script>
