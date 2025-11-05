<script setup lang="ts">
/**
 * Demo de HierarchicalPanel
 * 
 * Muestra el panel con jerarquías visuales usando Juntas de Accionistas
 * Este panel combina UI profesional con funcionalidad de jerarquías
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
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg
              class="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold">HierarchicalPanel Demo</h1>
            <p class="text-gray-600">UI con Jerarquías Visuales</p>
          </div>
        </div>
      </div>

      <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold mb-3 text-indigo-900">
          🎨 UI Profesional + Jerarquías
        </h2>
        <p class="text-indigo-800 mb-4">
          <strong>HierarchicalPanel</strong> combina lo mejor de ambos mundos:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
          <div>
            <p class="font-semibold mb-2">De Registro de Sociedades:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Checkmarks azules</li>
              <li>Líneas conectoras</li>
              <li>Hover effects</li>
              <li>Descripciones claras</li>
            </ul>
          </div>
          <div>
            <p class="font-semibold mb-2">De Nuestro Sistema:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Jerarquías 4 niveles</li>
              <li>Expand/collapse</li>
              <li>Indent visual</li>
              <li>Navegación compleja</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white border rounded-lg p-6">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <svg
              class="w-5 h-5 text-purple-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Checkmarks</h3>
          <p class="text-sm text-gray-600">
            Estados visuales claros (completado, actual, pendiente)
          </p>
        </div>

        <div class="bg-white border rounded-lg p-6">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Jerarquías</h3>
          <p class="text-sm text-gray-600">
            4 niveles con indent visual y expand/collapse
          </p>
        </div>

        <div class="bg-white border rounded-lg p-6">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <svg
              class="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="font-semibold mb-2">Rápido</h3>
          <p class="text-sm text-gray-600">
            Navegación intuitiva, colapsa lo que no necesitas
          </p>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-6 mb-8">
        <h3 class="font-semibold mb-4">Características Implementadas</h3>
        <div class="space-y-4 text-sm">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="font-medium text-gray-700">Checkmarks Profesionales</p>
              <p class="text-gray-600">
                Círculos con check (completado), punto (actual), vacío (pendiente)
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="font-medium text-gray-700">Líneas Conectoras</p>
              <p class="text-gray-600">
                Líneas verticales que conectan items, colores según estado
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="font-medium text-gray-700">Expand/Collapse</p>
              <p class="text-gray-600">
                Botones con flecha para expandir/colapsar items con hijos
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="font-medium text-gray-700">Indent Visual</p>
              <p class="text-gray-600">
                16px por nivel, máximo 4 niveles (64px de indent)
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="font-medium text-gray-700">Recursivo</p>
              <p class="text-gray-600">
                Componente HierarchicalItem se llama a sí mismo para hijos
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="font-medium text-gray-700">Badges de Nivel (Opcional)</p>
              <p class="text-gray-600">
                Muestra L0, L1, L2, L3, L4 con colores diferentes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-semibold mb-3 text-yellow-900">
          ⚡ Ventaja sobre Registro de Sociedades
        </h3>
        <p class="text-yellow-800 mb-3">
          Registro de Sociedades tiene UI excelente pero <strong>no soporta jerarquías</strong>.
        </p>
        <p class="text-yellow-800">
          HierarchicalPanel mantiene esa UI profesional y <strong>agrega jerarquías de 4 niveles</strong>.
        </p>
      </div>

      <div class="bg-white border rounded-lg p-6">
        <h3 class="font-semibold mb-3">Mira el Sidebar Izquierdo</h3>
        <p class="text-sm text-gray-600 mb-4">
          El sidebar de esta página usa <strong>mode="hierarchical"</strong> en vez de
          <strong>mode="wizard"</strong>.
        </p>
        <p class="text-sm text-gray-600">
          Verás items con jerarquía visual, expand/collapse, e indent por nivel. Todo con checkmarks y líneas conectoras profesionales.
        </p>
      </div>

      <div class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 class="font-semibold mb-2">Debug Info:</h3>
        <div class="space-y-1 text-sm">
          <p><strong>Layout:</strong> dual-panel-layout</p>
          <p><strong>Modo Sidebar:</strong> hierarchical</p>
          <p><strong>Ruta:</strong> {{ route.path }}</p>
          <p><strong>Panel:</strong> HierarchicalPanel + HierarchicalItem</p>
        </div>
      </div>
    </div>
  </div>
</template>

