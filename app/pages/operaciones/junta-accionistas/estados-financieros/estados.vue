<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Estados Financieros</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta sub-página se revisan y registran los
        <strong>estados financieros de la sociedad</strong>
        . Se presentan los balances, estados de resultados y otros documentos contables.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Estados Financieros"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: estados-financieros/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Estados Financieros - Detalle (Sub-paso)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: estados-financieros/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/estados-financieros/estados
  // Enum: JuntaRoutes.ESTADOS_DETALLE
</script>
