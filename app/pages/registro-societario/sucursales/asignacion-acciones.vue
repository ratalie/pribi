<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Asignación de Acciones</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta página se realiza la
        <strong>asignación de acciones a accionistas</strong>
        . Se distribuyen las acciones entre los distintos accionistas de la sociedad.
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
  layout: "dual-panel-layout",
});

  // Página: Asignación de Acciones (Sucursales)
  // Nivel: 0 (Página - flat structure)
  // Flujo: Sucursales (Registro Societario)
  // RightSidebar: Disabled (estructura plana)
  // Ruta: /registro-societario/sucursales/asignacion-acciones
  // Enum: SucursalesRoutes.ASIGNACION_ACCIONES
</script>
