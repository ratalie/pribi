<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Prueba básica de @nuxt/icon -->
    <NuxtIconTest />
    
    <!-- Nuevo: Sistema unificado con ProboIcon -->
    <ProboIconExample />
    
    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h3 class="font-semibold mb-2">📚 Cómo usar @nuxt/icon:</h3>
      <div class="space-y-2 text-sm">
        <p><strong>Básico:</strong> <code>&lt;Icon name="lucide:users" /&gt;</code></p>
        <p><strong>Con tamaño:</strong> <code>&lt;Icon name="lucide:settings" size="24px" /&gt;</code></p>
        <p><strong>Con clases:</strong> <code>&lt;Icon name="heroicons:check" class="text-green-500" /&gt;</code></p>
        <p><strong>Buscar iconos:</strong> Visita <a href="https://icones.js.org" target="_blank" class="text-blue-600 underline">icones.js.org</a></p>
      </div>
    </div>
    
    <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
      <h3 class="font-semibold mb-2">🚀 Sistema Unificado (getIcon + @nuxt/icon):</h3>
      <div class="space-y-2 text-sm">
        <p><strong>Con ProboIcon (Recomendado):</strong> <code>&lt;ProboIcon name="Users" /&gt;</code></p>
        <p><strong>Con getIcon manual:</strong> <code>&lt;component :is="getIcon('Users')" /&gt;</code> o <code>&lt;Icon :name="getIcon('CollaborationIcon')" /&gt;</code></p>
        <p><strong>Agregar iconos Iconify:</strong> Agrega al <code>iconMap</code> en <code>app/utils/iconMapper.ts</code></p>
        <p><strong>Documentación completa:</strong> Ver <code>docs/technical/ICON_MAPPER_EXTENDED.md</code></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Página de prueba para @nuxt/icon
// Visita: http://localhost:3000/test-nuxt-icon
</script>

