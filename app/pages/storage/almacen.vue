<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Selector de Sociedades -->
      <SocietySelector />
      
      <!-- Vista de Almacén -->
      <AlmacenView />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AlmacenView from "~/components/repository/AlmacenView.vue";
  import SocietySelector from "~/components/repository/SocietySelector.vue";

  useHead({
    title: "Almacén - Repositorio - PROBO",
  });
</script>
