<template>
  <div class="historial-table-wrapper">
    <div class="historial-table-header">
      <HistorialHeader :total="total" />
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

  interface Props {
    data: SociedadResumenDTO[];
    isLoading: boolean;
    actions: TableAction[];
    getEstado: (sociedad: SociedadResumenDTO) => EstadoSociedad;
  }

  const props = defineProps<Props>();

  const total = computed(() => props.data.length);
</script>

<style scoped>
  .historial-table-wrapper {
    background-color: white;
    border-radius: 0.75rem;
    border: 1px solid rgb(229, 231, 235);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .historial-table-header {
    padding: 1rem;
    border-bottom: 1px solid rgb(229, 231, 235);
  }

  /* Breakpoint >= 1280px y < 1440px */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .historial-table-header {
      padding: 1.25rem;
    }
  }

  /* Breakpoint >= 1440px */
  @media (min-width: 1440px) {
    .historial-table-header {
      padding: 1.5rem;
    }
  }
</style>
