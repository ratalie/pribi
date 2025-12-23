<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3
            class="text-lg font-semibold mb-1"
            style="
              color: var(--text-primary);
              font-family: var(--font-primary);
            "
          >
            Sociedades Registradas
          </h3>
          <p
            class="text-sm"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            Total: {{ total }} {{ total === 1 ? "sociedad" : "sociedades" }}
          </p>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CustomTable from "~/components/tables/CustomTable.vue";
import {
  historialSociedadesTableConfig,
  historialSociedadesTableProps,
} from "~/config/tables/historial-sociedades.config";
import type { TableCellRenderer, TableAction } from "~/types/tables/table-config";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
import SociedadCard from "../molecules/SociedadCard.vue";
import EstadoBadge from "../molecules/EstadoBadge.vue";
import type { EstadoSociedad } from "../../types/historial.types";

interface Props {
  data: SociedadResumenDTO[];
  isLoading: boolean;
  actions: TableAction[];
  getEstado: (sociedad: SociedadResumenDTO) => EstadoSociedad;
}

const props = defineProps<Props>();

const total = computed(() => props.data.length);

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
    columnKey: "estado",
    render: (rowData: SociedadResumenDTO) => props.getEstado(rowData),
  },
];
</script>

