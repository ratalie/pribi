<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Capitalización de Créditos</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        Esta es la página principal del flujo de
        <strong>Capitalización de Créditos</strong>
        . Aquí se configura el aumento de capital mediante la capitalización de créditos contra
        la sociedad.
      </p>
      <p class="text-xs text-blue-500 mt-2">
        📌
        <strong>RightSidebar:</strong>
        Habilitado (muestra sub-pasos: Acreedores → Créditos → Votación)
      </p>
      <p class="text-xs text-purple-500 mt-1">
        🔹
        <strong>Nivel 2:</strong>
        Página padre de 3 sub-páginas en rightSidebar
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Capitalización de Créditos (Principal)
  // Nivel: 2 (Categoria dentro de Aumento de Capital)
  // Padre: puntos-acuerdo.vue (Nivel 0 - PADRE COMPLEJO)
  // RightSidebar: Enabled (showChildrenInSidebar: true)
  // Hijos en RightSidebar: acreedores.vue, creditos.vue, votacion.vue
  // Ruta: /operaciones/junta-accionistas/capitalizacion-creditos
  // Enum: JuntaRoutes.CAPITALIZACION_CREDITOS
</script>
