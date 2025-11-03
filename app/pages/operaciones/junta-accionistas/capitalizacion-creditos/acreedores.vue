<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Acreedores</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta sub-página se gestionan los
        <strong>acreedores cuyos créditos serán capitalizados</strong>
        . Se identifica quiénes son los acreedores que participarán en la capitalización.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Capitalización de Créditos"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: capitalizacion-creditos/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Página: Acreedores (Sub-paso de Capitalización de Créditos)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: capitalizacion-creditos/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/capitalizacion-creditos/acreedores
  // Enum: JuntaRoutes.CAPITALIZACION_ACREEDORES
</script>
