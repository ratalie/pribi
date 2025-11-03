<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Acciones</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta página se gestionan las
        <strong>acciones de la sociedad</strong>
        . Se registran series, tipos, valores nominales, etc.
      </p>
      <p class="text-xs text-blue-500 mt-2">
        🔹
        <strong>Nivel 0:</strong>
        Página del flujo de Sucursales
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Flujo: Registro Societario → Sucursales</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "universal-flow-layout",
});

  // Página: Acciones (Sucursales)
  // Nivel: 0 (Página - flat structure)
  // Flujo: Sucursales (Registro Societario)
  // RightSidebar: Disabled (estructura plana)
  // Ruta: /registro-societario/sucursales/acciones
  // Enum: SucursalesRoutes.ACCIONES
</script>
