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
        En esta sub-página se registran los
        <strong>detalles del pronunciamiento sobre la gestión social</strong>
        . Se documentan las observaciones o aprobaciones sobre la gestión del
        directorio/gerencia.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Pronunciamiento sobre Gestión"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: pronunciamiento-gestion/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "universal-flow-layout",
});

  // Página: Pronunciamiento sobre Gestión - Detalle (Sub-paso)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: pronunciamiento-gestion/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/pronunciamiento-gestion/pronunciamiento
  // Enum: JuntaRoutes.PRONUNCIAMIENTO_DETALLE
</script>
