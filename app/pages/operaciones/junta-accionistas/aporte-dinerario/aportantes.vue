<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Aportantes</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta sub-página se gestionan los
        <strong>aportantes del capital dinerario</strong>
        . Se define quiénes realizarán los aportes en dinero.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Aporte Dinerario"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: aporte-dinerario/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Aportantes (Sub-paso de Aporte Dinerario)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: aporte-dinerario/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/aporte-dinerario/aportantes
  // Enum: JuntaRoutes.APORTE_DINERARIO_APORTANTES

  definePageMeta({
    layout: "dual-panel-layout",
  });
</script>
