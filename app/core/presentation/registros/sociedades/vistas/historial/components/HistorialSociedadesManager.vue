<template>
  <div class="min-h-full">
    <HistorialSociedadesHeader
      :show-delete-all="sociedades.length > 0"
      :is-loading="isLoading"
      :search-query="searchQuery"
      @go-to-test="goToTestPage"
      @create="handleCreate"
      @delete-all="handleDeleteAll"
      @update:search-query="(value) => searchQuery = value"
    />

    <!-- Responsive container: px-4 (<1280), px-6 (1280-1440), px-8 (>1440) -->
    <div class="vista-container">
      <HistorialSociedadesTable
        :data="sociedades"
        :is-loading="isLoading"
        :actions="tableActions"
        :get-estado="getEstado"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHistorialSociedades } from "../composables/useHistorialSociedades";
  import HistorialSociedadesHeader from "./organisms/HistorialSociedadesHeader.vue";
  import HistorialSociedadesTable from "./organisms/HistorialSociedadesTable.vue";

  const {
    sociedades,
    isLoading,
    searchQuery,
    getEstado,
    goToTestPage,
    handleCreate,
    handleDeleteAll,
    tableActions,
  } = useHistorialSociedades();
</script>

<style scoped>
  /* Sistema de estilos responsivos consistente - Estilo v2.5 */
  .vista-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 1rem; /* Default: < 1280px */
    min-height: calc(100vh - 200px);
  }

  /* Breakpoint >= 1280px y < 1440px */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .vista-container {
      padding: 1.5rem;
    }
  }

  /* Breakpoint >= 1440px */
  @media (min-width: 1440px) {
    .vista-container {
      padding: 2rem;
    }
  }
</style>
