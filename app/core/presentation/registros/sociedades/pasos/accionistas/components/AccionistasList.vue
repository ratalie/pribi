<script setup lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import DataTableDropDown from "~/components/base/tables/DataTableDropDown.vue";
  import EmptyTableMessage from "~/components/base/tables/EmptyTableMessage.vue";

  import type { AccionistaRow } from "../types";

  interface Props {
    items?: AccionistaRow[];
    isLoading?: boolean;
    readonly?: boolean;
    titleMenu?: string;
    actions?: {
      label: string;
      icon?: string;
      separatorLine?: boolean;
      onClick: (id: string) => void;
    }[];
  }

  withDefaults(defineProps<Props>(), {
    items: () => [],
    isLoading: false,
    readonly: false,
    titleMenu: undefined,
    actions: undefined,
  });
</script>

<template>
  <div class="overflow-hidden bg-white">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            Accionista
          </TableHead>
          <TableHead
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            Tipo
          </TableHead>
          <TableHead
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            Documento
          </TableHead>
          <TableHead v-if="actions && !readonly" class="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="isLoading">
          <TableRow>
            <TableCell :colspan="3 + (actions && !readonly ? 1 : 0)" class="h-24">
              <EmptyTableMessage />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="items.length === 0">
          <TableRow>
            <TableCell :colspan="3 + (actions && !readonly ? 1 : 0)" class="h-24">
              <EmptyTableMessage />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow v-for="item in items" :key="item.id">
            <TableCell
              class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ item.etiqueta }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ item.tipo }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ item.documento }}
            </TableCell>
            <!-- Celda de acciones -->
            <TableCell v-if="actions && !readonly" class="w-auto">
              <DataTableDropDown
                :item-id="item.id"
                :title-menu="titleMenu"
                :actions="actions"
              />
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
