<script setup lang="ts">
/**
 * Demo del DualPanelSidebar
 * 
 * Página de testing para ver el nuevo sistema con UI de Registro de Sociedades
 */

definePageMeta({
  layout: "dual-panel-layout",
});
</script>

<template>
  <div class="p-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-6">Demo DualPanelSidebar</h1>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4 text-blue-900">
          ✨ Nuevo Sistema con UI Profesional
        </h2>
        <p class="text-blue-800 mb-4">
          Este layout usa <strong>DualPanelSidebar</strong> con UI estilo Registro de
          Sociedades:
        </p>
        <ul class="list-disc list-inside space-y-2 text-blue-800">
          <li>Checkmarks azules para pasos completados</li>
          <li>Líneas conectoras verticales</li>
          <li>Descripciones bajo cada paso</li>
          <li>Hover effects profesionales</li>
          <li>Soporta jerarquías (que Sociedades no tiene)</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white border rounded-lg p-6">
          <h3 class="font-semibold mb-2">Sidebar Izquierdo</h3>
          <p class="text-gray-600 text-sm">
            Navegación principal con niveles 0-2
          </p>
        </div>

        <div class="bg-white border rounded-lg p-6">
          <h3 class="font-semibold mb-2">Sidebar Derecho</h3>
          <p class="text-gray-600 text-sm">
            Navegación contextual con niveles 3-4
          </p>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-6">
        <h3 class="font-semibold mb-4">Características</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div class="text-2xl mb-2">✅</div>
            <p class="font-medium">Config Reutilizable</p>
            <p class="text-sm text-gray-600">
              Usa FlowConfig + SidebarConfig
            </p>
          </div>

          <div>
            <div class="text-2xl mb-2">🎨</div>
            <p class="font-medium">UI Profesional</p>
            <p class="text-sm text-gray-600">
              Basada en Registro de Sociedades
            </p>
          </div>

          <div>
            <div class="text-2xl mb-2">🔄</div>
            <p class="font-medium">Intercambiable</p>
            <p class="text-sm text-gray-600">
              Múltiples modos de panel
            </p>
          </div>
        </div>
      </div>

      <div class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 class="font-semibold mb-2">Ruta actual:</h3>
        <code class="text-sm text-gray-700">{{ $route.path }}</code>
      </div>
    </div>
  </div>
</template>

