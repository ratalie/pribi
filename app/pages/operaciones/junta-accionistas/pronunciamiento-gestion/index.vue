<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Pronunciamiento sobre Gestión</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        Esta es la página principal del flujo de
        <strong>Pronunciamiento sobre la Gestión Social</strong>
        . Aquí se configura el pronunciamiento de los accionistas sobre la gestión de la
        administración.
      </p>
      <p class="text-xs text-blue-500 mt-2">
        📌
        <strong>RightSidebar:</strong>
        Habilitado (muestra sub-pasos: Pronunciamiento → Votación)
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
definePageMeta({
  layout: "dual-panel-layout",
});

  // Página: Pronunciamiento sobre Gestión (Principal)
  // Nivel: 2 (Categoria dentro de Gestión Social)
  // Padre: puntos-acuerdo.vue (Nivel 0 - PADRE COMPLEJO)
  // RightSidebar: Enabled (showChildrenInSidebar: true)
  // Hijos en RightSidebar: pronunciamiento.vue, votacion.vue
  // Ruta: /operaciones/junta-accionistas/pronunciamiento-gestion
  // Enum: JuntaRoutes.PRONUNCIAMIENTO_GESTION
</script>
