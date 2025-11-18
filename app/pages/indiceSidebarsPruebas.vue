<template>
  <div class="flex gap-6 flex-col p-24">
    <h1 class="text-3xl font-bold mb-4">Pruebas de Sidebars con FlowConfigs</h1>

    <div class="space-y-4">
      <NuxtLink
        to="/operaciones/junta-accionistas/seleccion-agenda"
        class="block p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition"
      >
        <h2 class="text-xl font-semibold text-blue-600 dark:text-blue-400">
          📋 Junta de Accionistas
        </h2>
        <p class="text-sm text-muted-foreground mt-2">
          Sidebar jerárquico con 4 niveles de navegación
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          → /operaciones/junta-accionistas/seleccion-agenda
        </p>
      </NuxtLink>

      <NuxtLink
        to="/registro-societario/sucursales/datos-sociedad"
        class="block p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition"
      >
        <h2 class="text-xl font-semibold text-green-600 dark:text-green-400">🏢 Sucursales</h2>
        <p class="text-sm text-muted-foreground mt-2">
          Sidebar secuencial con 6 pasos lineales
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          → /registro-societario/sucursales/datos-sociedad
        </p>
      </NuxtLink>
    </div>

    <div class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
      <h3 class="font-semibold mb-2">ℹ️ Información:</h3>
      <ul class="text-sm space-y-1">
        <li>• Cada link te lleva al primer paso del flujo</li>
        <li>• El sidebar se renderiza automáticamente según el FlowConfig</li>
        <li>• Puedes navegar entre pasos usando el sidebar</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
