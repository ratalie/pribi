<template>
  <div class="min-h-full">
    <HistorialSociedadesHeader
      :title="'Registro de Sociedades'"
      :description="`${sociedades.length} ${
        sociedades.length === 1 ? 'sociedad registrada' : 'sociedades registradas'
      }`"
      @create="handleCreate"
    />

    <!-- Responsive container: px-4 (<1280), px-6 (1280-1440), px-8 (>1440) -->
    <div class="vista-container">
      <HistorialSociedadesTable
        :data="sociedades"
        :is-loading="isLoading"
        :actions="tableActions"
        :get-estado="getEstado"
        :search-query="searchQuery"
        :selected-tipo="selectedTipo"
        :selected-estado="selectedEstado"
        :tipos-disponibles="tiposDisponibles"
        @update:search-query="(val: string) => searchQuery = val"
        @update:selected-tipo="(val: string) => selectedTipo = val"
        @update:selected-estado="(val: string) => selectedEstado = val"
      />
    </div>

    <!-- Modal de Eliminación -->
    <DeleteSociedadModal
      v-if="sociedadToDelete"
      :is-open="deleteModalOpen"
      :razon-social="sociedadToDelete.razonSocial"
      :is-loading="isDeleting"
      @update:is-open="(val: boolean) => deleteModalOpen = val"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { useHistorialSociedades } from "../composables/useHistorialSociedades";
  import HistorialSociedadesHeader from "./organisms/HistorialSociedadesHeader.vue";
  import HistorialSociedadesTable from "./organisms/HistorialSociedadesTable.vue";
  import DeleteSociedadModal from "./organisms/DeleteSociedadModal.vue";

  const {
    sociedades,
    isLoading,
    searchQuery,
    selectedTipo,
    selectedEstado,
    deleteModalOpen,
    sociedadToDelete,
    isDeleting,
    tiposDisponibles,
    getEstado,
    handleCreate,
    handleDelete,
    closeDeleteModal,
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
