<script setup lang="ts">
/**
 * Índice de Testing - DualPanelSidebar
 * 
 * Página de inicio para todas las demos del nuevo sistema
 */
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-12">
    <div class="max-w-5xl mx-auto">
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4">DualPanelSidebar - Testing</h1>
        <p class="text-xl text-gray-600">
          Nuevo sistema de sidebars con UI profesional estilo Registro de Sociedades
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <h2 class="text-2xl font-semibold mb-4">🎯 Objetivo del Sistema</h2>
        <p class="text-gray-700 mb-4">
          Crear un sistema de sidebars que combine:
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>
            <strong>Configuración reutilizable</strong> (FlowConfig + SidebarConfig) - de
            nuestro sistema actual
          </li>
          <li>
            <strong>UI profesional</strong> (checkmarks, líneas conectoras) - de Registro
            de Sociedades
          </li>
          <li>
            <strong>Funcionalidad completa</strong> (jerarquías, filtrado contextual) - de
            nuestro sistema
          </li>
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <NuxtLink
          to="/test/dual-panel-demo"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">Demo General</h3>
          <p class="text-sm text-gray-600">
            Explicación y características del nuevo sistema
          </p>
        </NuxtLink>

        <NuxtLink
          to="/test/juntas-dual-panel"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-blue-600"
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
          <h3 class="text-lg font-semibold mb-2">Juntas (Wizard)</h3>
          <p class="text-sm text-gray-600">
            Flujo con UI wizard estilo Sociedades
          </p>
        </NuxtLink>

        <NuxtLink
          to="/test/sucursales-dual-panel"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-green-600"
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
          <h3 class="text-lg font-semibold mb-2">Sucursales (Wizard)</h3>
          <p class="text-sm text-gray-600">
            Flujo lineal simple wizard
          </p>
        </NuxtLink>

        <NuxtLink
          to="/test/hierarchical-demo"
          class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
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
          <h3 class="text-lg font-semibold mb-2">Hierarchical Mode ✨</h3>
          <p class="text-sm text-gray-600">
            UI con jerarquías visuales + checkmarks
          </p>
        </NuxtLink>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-semibold mb-3 text-blue-900">
          📊 Comparación: Sistemas Actuales
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-blue-200">
                <th class="text-left py-2 px-3">Aspecto</th>
                <th class="text-left py-2 px-3">Registro Sociedades</th>
                <th class="text-left py-2 px-3">Nuestro Sistema (Actual)</th>
                <th class="text-left py-2 px-3">DualPanelSidebar (Nuevo)</th>
              </tr>
            </thead>
            <tbody class="text-blue-900">
              <tr class="border-b border-blue-100">
                <td class="py-2 px-3 font-medium">UI</td>
                <td class="py-2 px-3">⭐⭐⭐⭐⭐</td>
                <td class="py-2 px-3">⭐⭐⭐</td>
                <td class="py-2 px-3">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr class="border-b border-blue-100">
                <td class="py-2 px-3 font-medium">Jerarquías</td>
                <td class="py-2 px-3">❌</td>
                <td class="py-2 px-3">✅ (4 niveles)</td>
                <td class="py-2 px-3">✅ (4 niveles)</td>
              </tr>
              <tr class="border-b border-blue-100">
                <td class="py-2 px-3 font-medium">Config Reutilizable</td>
                <td class="py-2 px-3">❌</td>
                <td class="py-2 px-3">✅</td>
                <td class="py-2 px-3">✅</td>
              </tr>
              <tr class="border-b border-blue-100">
                <td class="py-2 px-3 font-medium">Checkmarks</td>
                <td class="py-2 px-3">✅</td>
                <td class="py-2 px-3">❌</td>
                <td class="py-2 px-3">✅</td>
              </tr>
              <tr>
                <td class="py-2 px-3 font-medium">Líneas Conectoras</td>
                <td class="py-2 px-3">✅</td>
                <td class="py-2 px-3">❌</td>
                <td class="py-2 px-3">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold mb-3">✅ Lo Que Funciona</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>✅ StatusIcon con 5 estados</li>
            <li>✅ StepWizardPanel (modo wizard)</li>
            <li>✅ HierarchicalPanel (modo hierarchical) ✨</li>
            <li>✅ Adaptadores FlowConfig → NavigationStep[]</li>
            <li>✅ DualPanelLayout con sidebars izq/der</li>
            <li>✅ 5 páginas de testing funcionando</li>
          </ul>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold mb-3">📋 Próximos Pasos</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>⏳ Testing con datos reales</li>
            <li>⏳ AdminNavPanel (futuro)</li>
            <li>⏳ Demo para equipos</li>
            <li>⏳ Migrar páginas reales de Juntas/Sucursales</li>
          </ul>
        </div>
      </div>

      <div class="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 class="font-semibold mb-2">📚 Documentación</h3>
        <p class="text-sm text-gray-600 mb-3">
          Para más información, lee los documentos en:
        </p>
        <code class="text-xs bg-white px-2 py-1 rounded">
          docs/issues/sidebar-estudio/
        </code>
        <ul class="mt-3 space-y-1 text-sm text-gray-600">
          <li>→ 00-START-HERE.md</li>
          <li>→ PLAN-DUAL-PANEL-SIDEBAR.md</li>
          <li>→ ANALISIS-VISUAL-SIDEBARS.md</li>
        </ul>
      </div>
    </div>
  </div>
</template>

