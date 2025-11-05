<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Votación - Remoción de Directores</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta sub-página se registra la
        <strong>votación del acuerdo de remoción de directores</strong>
        . Se captura el resultado de la votación de los accionistas sobre este punto.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Remoción de Directores"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: remocion-directores/index.vue</p>
      <p class="text-xs text-orange-500 mt-2">
        ⚡
        <strong>Última sub-página del flujo de Remoción de Directores</strong>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});

  // Página: Votación - Remoción de Directores (Sub-paso final)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: remocion-directores/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/remocion-directores/votacion
  // Enum: JuntaRoutes.REMOCION_DIRECTORES_VOTACION
</script>
