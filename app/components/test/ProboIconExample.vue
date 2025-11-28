<template>
  <div class="p-8 space-y-6 border rounded-lg">
    <h2 class="text-2xl font-bold">Ejemplo: ProboIcon (Sistema Unificado)</h2>
    
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Iconos Lucide (Componentes Vue):</h3>
        <div class="flex gap-4 items-center flex-wrap">
          <ProboIcon name="Users" class="w-6 h-6 text-blue-500" />
          <ProboIcon name="Settings" class="w-6 h-6 text-green-500" />
          <ProboIcon name="Check" class="w-6 h-6 text-red-500" />
          <ProboIcon name="LoaderCircle" class="w-6 h-6 text-purple-500 animate-spin" />
          <span class="text-sm text-gray-600">getIcon("Users") → Componente Lucide</span>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-2">Iconos Iconify (Strings):</h3>
        <div class="flex gap-4 items-center flex-wrap">
          <ProboIcon name="CollaborationIcon" class="w-6 h-6 text-indigo-500" />
          <span class="text-sm text-gray-600">
            getIcon("CollaborationIcon") → "streamline-freehand:collaboration-meeting-team-file"
          </span>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-2">Comparación: Antes vs Ahora</h3>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded space-y-2">
          <div>
            <p class="text-sm font-mono text-gray-700 dark:text-gray-300">
              <strong>Antes:</strong> Necesitabas lógica condicional
            </p>
            <pre class="text-xs mt-1 bg-gray-900 text-green-400 p-2 rounded overflow-x-auto"><code>&lt;component :is="getIcon('Users')" v-if="getIcon('Users')" /&gt;
&lt;Icon v-else name="streamline-freehand:..." /&gt;</code></pre>
          </div>
          <div>
            <p class="text-sm font-mono text-gray-700 dark:text-gray-300">
              <strong>Ahora:</strong> Un solo componente detecta automáticamente
            </p>
            <pre class="text-xs mt-1 bg-gray-900 text-green-400 p-2 rounded overflow-x-auto"><code>&lt;ProboIcon name="Users" /&gt;
&lt;ProboIcon name="CollaborationIcon" /&gt;</code></pre>
          </div>
        </div>
      </div>

      <div class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded">
        <p class="text-sm text-green-800 dark:text-green-400">
          ✅ <strong>Sistema unificado funcionando!</strong>
        </p>
        <p class="text-xs text-green-700 dark:text-green-500 mt-1">
          Ahora puedes usar <code>getIcon()</code> para iconos Lucide Y Iconify.
          <br />
          <code>ProboIcon</code> detecta automáticamente el tipo y renderiza correctamente.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ejemplo de uso del sistema unificado de iconos
</script>

