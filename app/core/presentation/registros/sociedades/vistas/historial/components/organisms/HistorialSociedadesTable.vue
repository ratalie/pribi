<template>
  <!-- HeaderContent: Buscador y Filtros -->
  <div class="historial-filters-section bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
    <HistorialFilters
      :search-query="searchQuery"
      :selected-tipo="selectedTipo"
      :selected-estado="selectedEstado"
      @update:search-query="$emit('update:search-query', $event)"
      @update:selected-tipo="$emit('update:selected-tipo', $event)"
      @update:selected-estado="$emit('update:selected-estado', $event)"
    />
  </div>

  <!-- Tabla -->
  <div class="historial-table-wrapper">
    <div class="historial-table-header">
      <HistorialTableHeader :total="total" />
    </div>

    <HistorialTableGrid
      :data="data"
      :is-loading="isLoading"
      :actions="actions"
      :get-estado="getEstado"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
  import type { TableAction } from "~/types/tables/table-config";
  import type { EstadoSociedad } from "../../types/historial.types";
  import HistorialTableHeader from "../molecules/HistorialTableHeader.vue";
  import HistorialTableGrid from "./HistorialTableGrid.vue";
  import HistorialFilters from "./HistorialFilters.vue";

  interface Props {
    data: SociedadResumenDTO[];
    isLoading: boolean;
    actions: TableAction[];
    getEstado: (sociedad: SociedadResumenDTO) => EstadoSociedad;
    searchQuery: string;
    selectedTipo: string;
    selectedEstado: string;
  }

  const props = defineProps<Props>();

  const total = computed(() => props.data.length);

  defineEmits<{
    "update:search-query": [value: string];
    "update:selected-tipo": [value: string];
    "update:selected-estado": [value: string];
  }>();
</script>

<style scoped>
  .historial-table-header {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgb(229, 231, 235);
  }

  /* Breakpoint >= 1280px y < 1440px */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .historial-table-header {
      padding: 0.625rem 0;
    }
  }

  /* Breakpoint >= 1440px */
  @media (min-width: 1440px) {
    .historial-table-header {
      padding: 0.75rem 0;
    }
  }
</style>
