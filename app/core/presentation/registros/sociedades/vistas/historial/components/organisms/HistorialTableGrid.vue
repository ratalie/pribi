<template>
  <CustomTable
    :config="historialSociedadesTableConfig"
    :data="data"
    :is-loading="isLoading"
    :cell-renderers="cellRenderers"
    :actions="actions"
    :get-row-id="(row) => row.idSociety"
    :header-text-size="historialSociedadesTableProps.headerTextSize"
    :container-padding="historialSociedadesTableProps.containerPadding"
    :header-padding="historialSociedadesTableProps.headerPadding"
    :header-padding-extra="historialSociedadesTableProps.headerPaddingExtra"
    :row-text-color="historialSociedadesTableProps.rowTextColor"
    empty-message="Aún no has registrado información. No te preocupes, puedes agregarla fácilmente haciendo click en el botón 'Crear Sociedad'"
  >
    <!-- Renderizado personalizado de razón social con nombre comercial -->
    <template #cell-razonSocial="{ rowData }">
      <SociedadCard
        :razon-social="rowData.razonSocial"
        :nombre-comercial="rowData.nombreComercial"
      />
    </template>

    <!-- Renderizado personalizado del estado con badge -->
    <template #cell-estado="{ rowData }">
      <EstadoBadge :estado="getEstado(rowData)" />
    </template>
  </CustomTable>
</template>

<script setup lang="ts">
  import CustomTable from "~/components/tables/CustomTable.vue";
  import {
    historialSociedadesTableConfig,
    historialSociedadesTableProps,
  } from "~/config/tables/historial-sociedades.config";
  import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
  import type { TableAction, TableCellRenderer } from "~/types/tables/table-config";
  import type { EstadoSociedad } from "../../types/historial.types";
  import EstadoBadge from "~/core/presentation/shared/components/molecules/EstadoBadge.vue";
  import SociedadCard from "../molecules/SociedadCard.vue";

  interface Props {
    data: SociedadResumenDTO[];
    isLoading: boolean;
    actions: TableAction[];
    getEstado: (sociedad: SociedadResumenDTO) => EstadoSociedad;
  }

  const props = defineProps<Props>();

  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "—";
    try {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "—";
    }
  };

  const cellRenderers: TableCellRenderer[] = [
    {
      columnKey: "razonSocial",
      render: (rowData: SociedadResumenDTO) => rowData.razonSocial || "Sociedad sin nombre",
    },
    {
      columnKey: "ruc",
      render: (rowData: SociedadResumenDTO) => rowData.ruc || "—",
    },
    {
      columnKey: "nombreComercial",
      render: (rowData: SociedadResumenDTO) => rowData.nombreComercial || "—",
    },
    {
      columnKey: "tipoSociedad",
      render: (rowData: SociedadResumenDTO) => rowData.tipoSocietario || "—",
    },
    {
      columnKey: "fechaConstitucion",
      render: (rowData: SociedadResumenDTO) => formatDate(rowData.fechaRegistroSociedad),
    },
    {
      columnKey: "fechaRegistro",
      render: (rowData: SociedadResumenDTO) => formatDate(rowData.createdAt),
    },
    {
      columnKey: "estado",
      render: (rowData: SociedadResumenDTO) => props.getEstado(rowData),
    },
  ];
</script>
