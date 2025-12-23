<script setup lang="ts">
  import type { CustomTableProps } from "~/types/tables/table-config";
  import { computed } from "vue";
  import TableEmpty from "./TableEmpty.vue";
  import TableRow from "./TableRow.vue";
  import TableSkeleton from "./TableSkeleton.vue";

  const props = withDefaults(defineProps<CustomTableProps>(), {
    headerTextSize: "text-t1",
    containerPadding: "p-4",
    headerPadding: "py-4",
    headerPaddingExtra: "",
    rowTextColor: "text-layout-gray-800",
  });

  const getRowId = (row: any, index: number): string | number => {
    if (props.getRowId) {
      return props.getRowId(row);
    }
    return row.id ?? row.idSociety ?? row.idFlow ?? index;
  };

  // Construir clases del header dinámicamente
  const headerClasses = computed(() => {
    // Usar border-b-[1px] para replicar exactamente v2.5
    const base = [props.config.gridClass, "border-b-[1px] border-gray-300", props.headerPadding];
    if (props.headerPaddingExtra) {
      base.push(props.headerPaddingExtra);
    } else {
      // Default: pr-16 gap-2 solo si no hay headerPaddingExtra
      if (props.headerPadding === "py-4") {
        base.push("pr-16 gap-2");
      }
    }
    return base;
  });

  // Clases del span del header (para aplicar gap-4 pl-8 cuando sea necesario)
  const headerSpanClasses = computed(() => {
    const base = [
      props.headerTextSize,
      "font-semibold font-primary block p-0 text-start",
    ];
    // Si hay headerPaddingExtra con gap-4 pl-8, aplicarlo al span
    if (props.headerPaddingExtra && props.headerPaddingExtra.includes("gap-4 pl-8")) {
      base.push("gap-4 pl-8");
    }
    return base;
  });
</script>

<template>
  <div
    :class="[
      'flex flex-col min-h-full scroll-container',
      props.containerPadding,
      props.maxHeight ? `max-h-[${props.maxHeight}]` : 'h-[calc(100vh-270px)]',
      'overflow-y-auto',
      props.config.containerClass,
    ]"
  >
    <!-- Header -->
    <div :class="headerClasses">
      <div v-for="column in props.config.columns" :key="column.id">
        <span
          v-if="column.label"
          :class="headerSpanClasses"
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
        :text-color="props.rowTextColor"
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
