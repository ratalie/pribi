<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Reparto de Dividendos</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta sub-página se registran los
        <strong>detalles del reparto de dividendos</strong>
        . Se especifican montos, fechas de pago, formas de distribución, etc.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Reparto de Dividendos"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: reparto-dividendos/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});

  // Página: Reparto de Dividendos - Detalle (Sub-paso)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: reparto-dividendos/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/reparto-dividendos/reparto
  // Enum: JuntaRoutes.REPARTO_DETALLE
</script>
