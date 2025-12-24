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
            Juntas de Accionistas
          </h3>
          <p
            class="text-sm"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            Total: {{ total }} {{ total === 1 ? "junta" : "juntas" }}
          </p>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CustomTable from "~/components/tables/CustomTable.vue";
import {
  historialJuntasTableConfig,
  historialJuntasTableProps,
} from "~/config/tables/historial-juntas.config";
import type { TableCellRenderer, TableAction } from "~/types/tables/table-config";
import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";
import EstadoBadge from "~/core/presentation/shared/components/molecules/EstadoBadge.vue";
import type { EstadoJunta } from "../../types/historial.types";

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




