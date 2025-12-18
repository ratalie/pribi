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
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import type { ApoderadoRow } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/types";

  interface Props {
    items: ApoderadoRow[];
    titleMenu?: string;
    actions?: {
      label: string;
      icon?: string;
      separatorLine?: boolean;
      onClick: (id: string) => void;
    }[];
  }

  const props = withDefaults(defineProps<Props>(), {
    titleMenu: undefined,
  });
</script>

<template>
  <div class="overflow-hidden bg-white">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16 w-12"
          >
            <!-- Columna de checkbox -->
          </TableHead>
          <TableHead
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            Nombre / Razón Social
          </TableHead>
          <TableHead
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            Tipo de Documento
          </TableHead>
          <TableHead
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            Nº de Documento
          </TableHead>
          <TableHead v-if="actions" class="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="items.length > 0">
          <TableRow v-for="item in items" :key="item.id">
            <TableCell
              class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
            >
              <Checkbox v-model="item.checked" :is-disabled="false" />
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ item.nombre }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ item.tipoDocumento }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ item.numeroDocumento }}
            </TableCell>
            <!-- Celda de acciones -->
            <TableCell v-if="props.actions" class="w-auto">
              <DataTableDropDown
                :item-id="item.id"
                :title-menu="props.titleMenu"
                :actions="props.actions"
              />
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow>
            <TableCell :colspan="4 + (props.actions ? 1 : 0)" class="h-24">
              <EmptyTableMessage />
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
