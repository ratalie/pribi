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
        En esta sub-página se registran los
        <strong>directores que serán removidos</strong>
        . Se especifican las causas y condiciones de la remoción.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Remoción de Directores"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: remocion-directores/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "universal-flow-layout",
});

  // Página: Remoción de Directores - Detalle (Sub-paso)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: remocion-directores/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/remocion-directores/remocion
  // Enum: JuntaRoutes.REMOCION_DIRECTORES_DETALLE
</script>
