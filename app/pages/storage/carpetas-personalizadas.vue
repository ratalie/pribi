<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4" style="font-family: var(--font-primary); color: var(--text-primary);">
      Carpetas Personalizadas
    </h1>
    <p class="text-base" style="font-family: var(--font-secondary); color: var(--text-muted);">
      Gestiona tus carpetas personalizadas con enlaces a documentos
    </p>
    
    <!-- Placeholder para carpetas personalizadas -->
    <div class="mt-8 p-6 bg-white rounded-lg border" style="border-color: var(--border-light);">
      <p class="text-sm" style="font-family: var(--font-secondary); color: var(--text-muted);">
        Carpetas Personalizadas en construcción - Próximamente se mostrarán:
      </p>
      <ul class="mt-4 list-disc list-inside space-y-2 text-sm" style="font-family: var(--font-secondary); color: var(--text-muted);">
        <li>Grid de carpetas personalizadas</li>
        <li>Crear nueva carpeta</li>
        <li>Enlaces de documentos</li>
        <li>Chat IA por carpeta</li>
        <li>Gestión de permisos</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Carpetas Personalizadas - Repositorio - PROBO",
});
</script>

