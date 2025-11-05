<script setup lang="ts">
/**
 * Testing: Juntas con DualPanelLayout
 * 
 * Prueba el sistema de Juntas con la nueva UI estilo Registro de Sociedades
 */

definePageMeta({
  layout: "dual-panel-layout",
});

const route = useRoute();
</script>

<template>
  <div class="p-12">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg
              class="w-6 h-6 text-primary-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold">Junta de Accionistas</h1>
            <p class="text-gray-600">Testing con DualPanelLayout</p>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold mb-3 text-blue-900">
          🎯 Nueva UI Aplicada
        </h2>
        <p class="text-blue-800 mb-4">
          Esta página usa el <strong>DualPanelLayout</strong> con UI profesional:
        </p>
        <ul class="list-disc list-inside space-y-2 text-blue-800 text-sm">
          <li><strong>Sidebar Izquierdo:</strong> Navegación principal (niveles 0-2)</li>
          <li>
            <strong>Sidebar Derecho:</strong> Navegación contextual (niveles 3-4)
          </li>
          <li><strong>Checkmarks:</strong> Estados visuales claros</li>
          <li><strong>Líneas conectoras:</strong> Guía visual del flujo</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white border rounded-lg p-6">
          <h3 class="font-semibold mb-3">Comparación: Antes vs. Ahora</h3>

          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-700">Antes (universal-flow-layout):</p>
              <ul class="text-xs text-gray-600 mt-1 space-y-1">
                <li>✅ Funcional</li>
                <li>⚠️ UI básica</li>
                <li>⚠️ Sin checkmarks</li>
              </ul>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700">
                Ahora (dual-panel-layout):
              </p>
              <ul class="text-xs text-gray-600 mt-1 space-y-1">
                <li>✅ Funcional</li>
                <li>✅ UI profesional</li>
                <li>✅ Con checkmarks</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-white border rounded-lg p-6">
          <h3 class="font-semibold mb-3">Ventajas del Nuevo Sistema</h3>
          <ul class="text-sm text-gray-600 space-y-2">
            <li>✨ UI como Registro de Sociedades</li>
            <li>🎯 Soporta jerarquías (4 niveles)</li>
            <li>🔄 Config reutilizable</li>
            <li>📱 Responsive</li>
          </ul>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-6">
        <h3 class="font-semibold mb-4">Pasos del Flujo</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <span class="text-gray-700">Selección de Agenda</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <span class="text-gray-700">Detalles de la Junta</span>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center"
            >
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <span class="text-blue-700 font-medium">Puntos de Acuerdo (Actual)</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span class="text-gray-500">Nombramiento</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span class="text-gray-500">Resumen</span>
          </div>
        </div>
      </div>

      <div class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 class="font-semibold mb-2">Debug Info:</h3>
        <div class="space-y-1 text-sm">
          <p><strong>Layout:</strong> dual-panel-layout</p>
          <p><strong>Ruta:</strong> {{ route.path }}</p>
          <p><strong>Modo:</strong> wizard (UI estilo Sociedades)</p>
        </div>
      </div>
    </div>
  </div>
</template>

