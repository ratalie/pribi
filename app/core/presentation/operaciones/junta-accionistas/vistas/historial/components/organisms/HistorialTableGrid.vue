<template>
  <CustomTable
    :config="historialJuntasTableConfig"
    :data="data"
    :is-loading="isLoading"
    :cell-renderers="cellRenderers"
    :actions="actions"
    :get-row-id="(row) => row.id"
    :header-text-size="historialJuntasTableProps.headerTextSize"
    :container-padding="historialJuntasTableProps.containerPadding"
    :header-padding="historialJuntasTableProps.headerPadding"
    :header-padding-extra="historialJuntasTableProps.headerPaddingExtra"
    :row-text-color="historialJuntasTableProps.rowTextColor"
    :row-padding="historialJuntasTableProps.rowPadding"
    :row-hover="historialJuntasTableProps.rowHover"
    :border-color="historialJuntasTableProps.borderColor"
    empty-message="Aún no has registrado información. No te preocupes, puedes hacerlo en cualquier momento."
  >
    <!-- Renderizado personalizado del estado con badge -->
    <template #cell-estado="{ rowData }">
      <EstadoBadge :estado="getEstado(rowData)" />
    </template>
  </CustomTable>
</template>

<script setup lang="ts">
  import CustomTable from "~/components/tables/CustomTable.vue";
  import {
    historialJuntasTableConfig,
    historialJuntasTableProps,
  } from "~/config/tables/historial-juntas.config";
  import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";
  import type { TableAction, TableCellRenderer } from "~/types/tables/table-config";
  import type { EstadoJunta } from "../../types/historial.types";
  import EstadoBadge from "~/core/presentation/shared/components/molecules/EstadoBadge.vue";

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

  const cellRenderers: TableCellRenderer[] = [
    {
      columnKey: "fechaJunta",
      render: (rowData: JuntaResumenDTO) => props.getFechaJunta(rowData),
    },
    {
      columnKey: "nombreJunta",
      render: (rowData: JuntaResumenDTO) => props.getNombreJunta(rowData),
    },
    {
      columnKey: "tipoJunta",
      render: (rowData: JuntaResumenDTO) => props.getTipoJunta(rowData),
    },
    {
      columnKey: "estado",
      render: (rowData: JuntaResumenDTO) => props.getEstado(rowData),
    },
  ];
</script>


