<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Detalles de la Junta</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        Configuración de los detalles de la junta: tipo, modo, fecha.
      </p>
      <p class="text-xs text-blue-500 mt-2">
        📌 Esta página tiene rightSidebar con sub-opciones
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Detalles de la Junta
  // Nivel: 0 (Principal)
  // RightSidebar: Habilitado (tipo, modo, fecha)
  // Ruta: /operaciones/junta-accionistas/detalles
</script>
