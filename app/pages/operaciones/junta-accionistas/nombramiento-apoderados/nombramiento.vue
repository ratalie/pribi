<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Nombramiento de Apoderados</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta sub-página se registran los
        <strong>datos de los apoderados que serán nombrados</strong>
        . Se identifica a las personas que recibirán poderes de representación.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Nombramiento de Apoderados"
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: nombramiento-apoderados/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "universal-flow-layout",
});

  // Página: Nombramiento de Apoderados - Detalle (Sub-paso)
  // Nivel: 3 (Sub-página en rightSidebar)
  // Padre: nombramiento-apoderados/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Ruta: /operaciones/junta-accionistas/nombramiento-apoderados/nombramiento
  // Enum: JuntaRoutes.NOMBRAMIENTO_APODERADOS_DETALLE
</script>
