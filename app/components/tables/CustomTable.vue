<script setup lang="ts">
  import type { CustomTableProps } from "~/types/tables/table-config";
  import TableEmpty from "./TableEmpty.vue";
  import TableRow from "./TableRow.vue";
  import TableSkeleton from "./TableSkeleton.vue";

  const props = defineProps<CustomTableProps>();

  const getRowId = (row: any, index: number): string | number => {
    if (props.getRowId) {
      return props.getRowId(row);
    }
    return row.id ?? row.idSociety ?? row.idFlow ?? index;
  };
</script>

<template>
  <div
    :class="[
      'flex flex-col p-4 min-h-full scroll-container',
      props.maxHeight ? `max-h-[${props.maxHeight}]` : 'h-[calc(100vh-270px)]',
      'overflow-y-auto',
      props.config.containerClass,
    ]"
  >
    <!-- Header -->
    <div :class="[props.config.gridClass, 'border-b border-gray-300 py-4 pr-16 gap-2']">
      <div v-for="column in props.config.columns" :key="column.id">
        <span
          v-if="column.label"
          class="text-t1 font-semibold font-primary block p-0 text-start"
        >
          {{ column.label }}
        </span>
        <span v-else class="block"></span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="props.isLoading">
      <TableSkeleton v-for="i in 4" :key="i" :config="props.config" />
    </div>

    <!-- Empty State -->
    <TableEmpty v-else-if="props.data.length === 0" :message="props.emptyMessage" />

    <!-- Data Rows -->
    <div v-else>
      <TableRow
        v-for="(row, index) in props.data"
        :key="getRowId(row, index)"
        :config="props.config"
        :row-data="row"
        :cell-renderers="props.cellRenderers"
        :actions="props.actions"
        :row-class="props.rowClass"
        :is-last="index === props.data.length - 1"
      >
        <!-- Slots para renderizado personalizado -->
        <template
          v-for="col in props.config.columns"
          :key="`slot-${col.key}`"
          #[`cell-${col.key}`]="{ rowData, column: colData }"
        >
          <slot :name="`cell-${col.key}`" :row-data="rowData" :column="colData" />
        </template>
      </TableRow>
    </div>
  </div>
</template>

<style scoped>
  .scroll-container {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }

  .scroll-container::-webkit-scrollbar {
    width: 8px;
  }

  .scroll-container::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  .scroll-container::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
  }

  .scroll-container::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
  }
</style>
