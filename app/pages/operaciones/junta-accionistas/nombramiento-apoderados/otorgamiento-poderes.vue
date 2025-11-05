<template>
  <div class="page-container p-6">
    <div class="space-y-2 mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Otorgamiento de Poderes</h1>
      <p class="text-sm text-muted-foreground font-mono">
        {{ $route.path }}
      </p>
    </div>

    <div class="placeholder mt-4">
      <p class="text-gray-600 dark:text-gray-300">
        En esta sub-página se definen los
        <strong>poderes específicos que se otorgarán a cada apoderado</strong>
        . Se especifican las facultades y limitaciones de cada poder.
      </p>
      <p class="text-xs text-green-500 mt-2">
        🔹
        <strong>Nivel 3:</strong>
        Sub-página visible en rightSidebar de "Nombramiento de Apoderados"
      </p>
      <p class="text-xs text-purple-500 mt-2">
        📌
        <strong>Scroll Anchors:</strong>
        Esta página tiene NIVEL 4 (scroll anchors) para cada apoderado
      </p>
      <p class="text-xs text-gray-400 mt-1">📂 Padre: nombramiento-apoderados/index.vue</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dual-panel-layout",
});

  // Página: Otorgamiento de Poderes (Sub-paso con scroll anchors)
  // Nivel: 3 (Sub-página en rightSidebar, pero con hijos Nivel 4)
  // Padre: nombramiento-apoderados/index.vue (Nivel 2)
  // RightSidebar: Aparece como hijo en sidebar del padre
  // Scroll Anchors: Tiene secciones ancladas para cada apoderado (Nivel 4)
  // Ruta: /operaciones/junta-accionistas/nombramiento-apoderados/otorgamiento-poderes
  // Enum: JuntaRoutes.NOMBRAMIENTO_APODERADOS_OTORGAMIENTO
</script>
