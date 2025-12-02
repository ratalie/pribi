<template>
  <CarpetaDetailView />
</template>

<script setup lang="ts">
  import CarpetaDetailView from "~/components/repository/CarpetaDetailView.vue";

  const route = useRoute();
  const _carpetaId = computed(() => route.params.id as string);

  useHead({
    title: `Carpeta - Repositorio - PROBO`,
  });
</script>
