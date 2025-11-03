<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Aplicación de Resultados</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta sub-página se registran los
        <strong>detalles de la aplicación de resultados</strong>
        . Se especifica cómo se distribuirán las utilidades o se cubrirán las pérdidas.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Aplicación de Resultados"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: aplicacion-resultados/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Aplicación de Resultados - Detalle (Sub-paso)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: aplicacion-resultados/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/aplicacion-resultados/aplicacion
  // Enum: JuntaRoutes.APLICACION_DETALLE
</script>
