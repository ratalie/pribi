<template>
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
      :get-fecha-junta="getFechaJunta"
      :get-nombre-junta="getNombreJunta"
      :get-tipo-junta="getTipoJunta"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";
  import type { TableAction } from "~/types/tables/table-config";
  import type { EstadoJunta } from "../../types/historial.types";
  import HistorialTableHeader from "../molecules/HistorialTableHeader.vue";
  import HistorialTableGrid from "./HistorialTableGrid.vue";

  interface Props {
    data: JuntaResumenDTO[];
    isLoading: boolean;
    actions: TableAction[];
    getEstado: (junta: JuntaResumenDTO) => EstadoJunta;
    getFechaJunta: (junta: JuntaResumenDTO) => string;
    getNombreJunta: (junta: JuntaResumenDTO) => string;
    getTipoJunta: (junta: JuntaResumenDTO) => string;
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




