<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4" style="font-family: var(--font-primary); color: var(--text-primary);">
      Almacén
    </h1>
    <p class="text-base" style="font-family: var(--font-secondary); color: var(--text-muted);">
      Documentos societarios - Gestión de archivos estilo Google Drive
    </p>
    
    <!-- Placeholder para almacén -->
    <div class="mt-8 p-6 bg-white rounded-lg border" style="border-color: var(--border-light);">
      <p class="text-sm" style="font-family: var(--font-secondary); color: var(--text-muted);">
        Almacén en construcción - Próximamente se mostrarán:
      </p>
      <ul class="mt-4 list-disc list-inside space-y-2 text-sm" style="font-family: var(--font-secondary); color: var(--text-muted);">
        <li>Vista Grid y Lista de documentos</li>
        <li>Navegación por carpetas</li>
        <li>Upload de archivos</li>
        <li>Crear carpetas</li>
        <li>Preview de documentos</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Almacén - Repositorio - PROBO",
});
</script>
