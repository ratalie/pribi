<script setup lang="ts">
/**
 * Testing: Sucursales con DualPanelLayout
 * 
 * Prueba el sistema de Sucursales con la nueva UI estilo Registro de Sociedades
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
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              class="w-6 h-6 text-green-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold">Registro de Sucursales</h1>
            <p class="text-gray-600">Testing con DualPanelLayout</p>
          </div>
        </div>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold mb-3 text-green-900">
          🏢 Flujo Simplificado
        </h2>
        <p class="text-green-800 mb-4">
          Sucursales usa un flujo <strong>lineal simple</strong> (6 pasos):
        </p>
        <ul class="list-disc list-inside space-y-2 text-green-800 text-sm">
          <li><strong>Ideal para UI wizard:</strong> Paso a paso claro</li>
          <li><strong>Sin jerarquías:</strong> Todos los pasos al mismo nivel</li>
          <li><strong>UI perfecta:</strong> Como Registro de Sociedades</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white border rounded-lg p-6">
          <h3 class="font-semibold mb-3">Características del Flujo</h3>
          <ul class="text-sm text-gray-600 space-y-2">
            <li>✅ 6 pasos secuenciales</li>
            <li>✅ Navegación lineal</li>
            <li>✅ Sin niveles anidados</li>
            <li>✅ Perfecto para wizard UI</li>
          </ul>
        </div>

        <div class="bg-white border rounded-lg p-6">
          <h3 class="font-semibold mb-3">Ventajas del DualPanel</h3>
          <ul class="text-sm text-gray-600 space-y-2">
            <li>🎨 UI profesional</li>
            <li>✅ Checkmarks y líneas</li>
            <li>📱 Responsive design</li>
            <li>🔄 Config reutilizable</li>
          </ul>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-6 mb-8">
        <h3 class="font-semibold mb-4">Pasos del Flujo de Sucursales</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <span class="text-gray-700">Datos de la Sucursal</span>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center"
            >
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span class="text-green-700 font-medium">Ubicación (Actual)</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span class="text-gray-500">Representante Legal</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span class="text-gray-500">Documentación</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span class="text-gray-500">Verificación</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span class="text-gray-500">Resumen</span>
          </div>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-6">
        <h3 class="font-semibold mb-3">Por Qué Sucursales es Ideal para Esta UI</h3>
        <div class="space-y-4 text-sm text-gray-600">
          <div>
            <p class="font-medium text-gray-700 mb-1">1. Flujo Lineal Simple</p>
            <p>
              Sin jerarquías complejas, perfecto para la UI wizard de Registro de
              Sociedades
            </p>
          </div>

          <div>
            <p class="font-medium text-gray-700 mb-1">2. Estados Claros</p>
            <p>Fácil visualizar progreso con checkmarks (completado, actual, pendiente)</p>
          </div>

          <div>
            <p class="font-medium text-gray-700 mb-1">3. Navegación Intuitiva</p>
            <p>Usuario sabe exactamente en qué paso está y cuántos faltan</p>
          </div>
        </div>
      </div>

      <div class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 class="font-semibold mb-2">Debug Info:</h3>
        <div class="space-y-1 text-sm">
          <p><strong>Layout:</strong> dual-panel-layout</p>
          <p><strong>Ruta:</strong> {{ route.path }}</p>
          <p><strong>Modo:</strong> wizard (UI estilo Sociedades)</p>
          <p><strong>Complejidad:</strong> Simple (6 pasos lineales)</p>
        </div>
      </div>
    </div>
  </div>
</template>

