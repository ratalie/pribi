<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Selector de Sociedades -->
      <SocietySelector />
      
      <!-- Vista de Documentos Generados -->
      <DocumentosGeneradosView />
    </div>
  </div>
</template>

<script setup lang="ts">
  import DocumentosGeneradosView from "~/components/repository/DocumentosGeneradosView.vue";
  import SocietySelector from "~/components/repository/SocietySelector.vue";

  useHead({
    title: "Documentos Generados - Repositorio - PROBO",
  });
</script>
