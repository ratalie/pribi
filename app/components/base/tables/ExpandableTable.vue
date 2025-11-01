<script setup lang="ts" generic="TData, TValue">
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
  import { ChevronRight } from "lucide-vue-next";
  import { computed, ref, useSlots } from "vue";
  import DataTableDropDown from "./DataTableDropDown.vue";
  import EmptyTableMessage from "./EmptyTableMessage.vue";

  const props = withDefaults(
    defineProps<{
      columns: ColumnDef<TData, TValue>[];
      data?: TData[];
      titleMenu?: string;
      actions?: {
        label: string;
        icon?: string;
        separatorLine?: boolean;
        onClick: (id: string) => void;
      }[];
      rowKey?: (row: TData, index: number) => string;
      expandLabel?: string;
      detailColumnLabel?: string;
    }>(),
    {
      data: () => [],
      titleMenu: undefined,
      actions: () => [],
      rowKey: undefined,
      expandLabel: "Ver detalles",
      detailColumnLabel: "",
    }
  );

  const table = useVueTable({
    get data() {
      return props.data;
    },
    get columns() {
      return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const slots = useSlots();
  const hasDetailSlot = computed(() => !!slots["row-details"]);
  const expandedKeys = ref<Set<string>>(new Set());

  const hasActions = computed(() => Boolean(props.actions?.length));

  const getRowKey = (row: TData, index: number, fallbackId: string) => {
    if (props.rowKey) return props.rowKey(row, index);
    const candidate = (row as any)?.id;
    if (candidate !== undefined && candidate !== null) return String(candidate);
    return fallbackId;
  };

  const toggleRow = (key: string) => {
    const next = new Set(expandedKeys.value);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    expandedKeys.value = next;
  };
</script>

<template>
  <div>
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
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
          <TableHead
            v-if="hasDetailSlot"
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            {{ detailColumnLabel }}
          </TableHead>
          <TableHead v-if="hasActions" class="w-12" />
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <template v-for="(row, rowIndex) in table.getRowModel().rows" :key="row.id">
            <TableRow>
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>

              <TableCell v-if="hasDetailSlot" class="w-36">
                <slot
                  name="detail-trigger"
                  :row="row.original"
                  :expanded="expandedKeys.has(getRowKey(row.original, rowIndex, row.id))"
                  :toggle="() => toggleRow(getRowKey(row.original, rowIndex, row.id))"
                >
                  <button
                    type="button"
                    class="flex items-center gap-1 text-gray-700 font-secondary t-t2 hover:text-gray-900 transition-colors"
                    @click="toggleRow(getRowKey(row.original, rowIndex, row.id))"
                  >
                    {{ expandLabel }}
                    <ChevronRight
                      class="w-4 h-4 transition-transform"
                      :class="
                        expandedKeys.has(getRowKey(row.original, rowIndex, row.id))
                          ? 'rotate-90'
                          : ''
                      "
                    />
                  </button>
                </slot>
              </TableCell>

              <TableCell v-if="hasActions" class="w-12">
                <DataTableDropDown
                  :item-id="getRowKey(row.original, rowIndex, row.id)"
                  :title-menu="titleMenu"
                  :actions="actions"
                />
              </TableCell>
            </TableRow>

            <TableRow
              v-if="
                hasDetailSlot && expandedKeys.has(getRowKey(row.original, rowIndex, row.id))
              "
            >
              <TableCell
                :colspan="
                  row.getVisibleCells().length + (hasDetailSlot ? 1 : 0) + (hasActions ? 1 : 0)
                "
                class="p-0"
              >
                <slot
                  name="row-details"
                  :row="row.original"
                  :expanded="expandedKeys.has(getRowKey(row.original, rowIndex, row.id))"
                />
              </TableCell>
            </TableRow>
          </template>
        </template>

        <template v-else>
          <TableRow>
            <TableCell
              :colspan="columns.length + (hasDetailSlot ? 1 : 0) + (hasActions ? 1 : 0)"
              class="h-24"
            >
              <EmptyTableMessage />
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
