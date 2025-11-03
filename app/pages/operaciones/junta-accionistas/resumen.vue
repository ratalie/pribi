<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Resumen de la Junta</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        Resumen general de todos los acuerdos tomados en la junta.
      </p>
      <p class="text-xs text-blue-500 mt-2">
        📌 Esta página tiene rightSidebar con scroll anchors a secciones de resumen
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Resumen
  // Nivel: 0 (Principal)
  // RightSidebar: Habilitado (scroll anchors a resúmenes)
  // Ruta: /operaciones/junta-accionistas/resumen
</script>
