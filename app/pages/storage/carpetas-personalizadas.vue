<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Selector de Sociedades -->
      <SocietySelector />
      
      <!-- Vista de Carpetas Personalizadas -->
      <CarpetasPersonalizadasView />
    </div>
  </div>
</template>

<script setup lang="ts">
  import CarpetasPersonalizadasView from "~/components/repository/CarpetasPersonalizadasView.vue";
  import SocietySelector from "~/components/repository/SocietySelector.vue";

  useHead({
    title: "Carpetas Personalizadas - Repositorio - PROBO",
  });
</script>
