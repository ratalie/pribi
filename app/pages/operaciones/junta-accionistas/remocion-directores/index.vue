<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Remoción de Directores</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        Esta es la página principal del flujo de
        <strong>Remoción de Directores</strong>
        . Aquí se configura la remoción de uno o más directores de la sociedad.
      </p>
      <p class="text-xs text-blue-500 mt-2">
        📌
        <strong>RightSidebar:</strong>
        Habilitado (muestra sub-pasos: Remoción → Votación)
      </p>
      <p class="text-xs text-purple-500 mt-1">
        🔹
        <strong>Nivel 2:</strong>
        Página padre de 2 sub-páginas en rightSidebar
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Remoción de Directores (Principal)
  // Nivel: 2 (Categoria dentro de Remociones)
  // Padre: puntos-acuerdo.vue (Nivel 0 - PADRE COMPLEJO)
  // RightSidebar: Enabled (showChildrenInSidebar: true)
  // Hijos en RightSidebar: remocion.vue, votacion.vue
  // Ruta: /operaciones/junta-accionistas/remocion-directores
  // Enum: JuntaRoutes.REMOCION_DIRECTORES
</script>
