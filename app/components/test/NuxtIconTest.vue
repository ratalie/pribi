<template>
  <div class="p-8 space-y-4 border rounded-lg">
    <h2 class="text-2xl font-bold">Prueba de @nuxt/icon</h2>
    
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Iconos de Lucide (equivalente a lucide-vue-next):</h3>
      <div class="flex gap-4 items-center">
        <Icon name="lucide:users" class="text-blue-500" />
        <Icon name="lucide:settings" class="text-green-500" />
        <Icon name="lucide:check" class="text-red-500" />
        <span class="text-sm text-gray-600">lucide:users, lucide:settings, lucide:check</span>
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Iconos de Heroicons:</h3>
      <div class="flex gap-4 items-center">
        <Icon name="heroicons:arrow-up-tray" class="text-purple-500" />
        <Icon name="heroicons:document-text" class="text-indigo-500" />
        <Icon name="heroicons:check-circle" class="text-pink-500" />
        <span class="text-sm text-gray-600">heroicons:arrow-up-tray, heroicons:document-text, heroicons:check-circle</span>
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Iconos de Material Design (MDI):</h3>
      <div class="flex gap-4 items-center">
        <Icon name="mdi:account" class="text-orange-500" />
        <Icon name="mdi:home" class="text-teal-500" />
        <Icon name="mdi:star" class="text-yellow-500" />
        <span class="text-sm text-gray-600">mdi:account, mdi:home, mdi:star</span>
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Diferentes tamaños:</h3>
      <div class="flex gap-4 items-center">
        <Icon name="lucide:heart" size="16px" class="text-red-500" />
        <Icon name="lucide:heart" size="24px" class="text-red-500" />
        <Icon name="lucide:heart" size="32px" class="text-red-500" />
        <Icon name="lucide:heart" size="48px" class="text-red-500" />
        <span class="text-sm text-gray-600">16px, 24px, 32px, 48px</span>
      </div>
    </div>

    <div class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded">
      <p class="text-sm text-green-800 dark:text-green-400">
        ✅ <strong>@nuxt/icon está configurado correctamente!</strong>
      </p>
      <p class="text-xs text-green-700 dark:text-green-500 mt-1">
        Puedes usar &lt;Icon name="collection:icon-name" /&gt; en cualquier componente.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente de prueba para verificar que @nuxt/icon funciona correctamente
// Puedes eliminar este componente después de verificar
</script>

