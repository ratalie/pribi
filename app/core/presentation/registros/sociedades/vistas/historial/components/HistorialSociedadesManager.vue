<template>
  <div class="min-h-full bg-gray-50">
    <HistorialSociedadesHeader
      :show-delete-all="sociedades.length > 0"
      :is-loading="isLoading"
      @go-to-test="goToTestPage"
      @create="handleCreate"
      @delete-all="handleDeleteAll"
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
    getEstado,
    goToTestPage,
    handleCreate,
    handleDeleteAll,
    tableActions,
  } = useHistorialSociedades();
</script>

<style scoped>
  /* Container principal con estilos de tarjeta - paddings optimizados */
  .vista-container {
    max-width: 1600px;
    /* margin: 1rem auto; */
    padding: 0.75rem;
    background-color: white;
    border-radius: 0.75rem;
    border: 1px solid rgb(229, 231, 235);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  /* Breakpoint >= 1280px y < 1440px */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .vista-container {
      margin: 1.25rem auto;
      padding: 1rem;
    }
  }

  /* Breakpoint >= 1440px */
  @media (min-width: 1440px) {
    .vista-container {
      margin: 1.5rem auto;
      padding: 1.25rem;
    }
  }
</style>
