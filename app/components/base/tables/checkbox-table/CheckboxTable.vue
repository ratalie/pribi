<script setup lang="ts" generic="TData extends BaseCheckboxRow, TValue">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import type { ColumnDef } from "@tanstack/vue-table";
  import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import DataTableDropDown from "../DataTableDropDown.vue";
  import EmptyTableMessage from "../EmptyTableMessage.vue";

  export interface BaseCheckboxRow {
    id: string;
    checked: boolean;
  }

  const props = defineProps<{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    titleMenu?: string;
    actions?: {
      label: string;
      icon?: string;
      separatorLine?: boolean;
      onClick: (id: string) => void;
    }[];
  }>();

  const emits = defineEmits(["update:checkedItems"]);
  const selectedAllChecked = ref(false);

  const table = useVueTable({
    get data() {
      return props.data;
    },
    get columns() {
      return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
  });
</script>

<template>
  <div>
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead>
            <Checkbox
              :model-value="selectedAllChecked"
              @update:model-value="
                (value) => {
                  selectedAllChecked = Boolean(value);
                  emits('update:checkedItems', selectedAllChecked);
                }
              "
            />
          </TableHead>

          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell>
              <Checkbox v-model="row.original.checked" />
            </TableCell>

            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>

            <!-- Celda de acciones -->
            <TableCell v-if="actions" class="w-12">
              <DataTableDropDown
                :item-id="row.original.id"
                :title-menu="titleMenu"
                :actions="actions"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="props.columns.length" class="h-24">
              <EmptyTableMessage />
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
