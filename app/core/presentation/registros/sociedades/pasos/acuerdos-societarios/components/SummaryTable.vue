<script setup lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import type { AcuerdoSocietario } from "~/core/hexag/registros/sociedades/pasos/acuerdos-societarios/domain";
  import { getIcon } from "~/utils/iconMapper";

  interface Props {
    items: AcuerdoSocietario | null;
    titleMenu?: string;
  }

  withDefaults(defineProps<Props>(), {
    titleMenu: undefined,
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
            Acuerdos
          </TableHead>
          <TableHead
            class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
          >
            Documentos
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
          >
            Estatutos Sociales
          </TableCell>
          <TableCell
            class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
          >
            <div v-if="items && items.archivoEstatutos" class="flex items-center gap-2">
              <component :is="getIcon('FileCheck')" class="w-5 h-5 text-gray-600" />
              <span>{{ items.archivoEstatutos.nombre }}</span>
            </div>
            <span v-else>-</span>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell
            class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
          >
            Convenios de Accionistas
          </TableCell>
          <TableCell
            class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
          >
            <div v-if="items && items.archivoAccionistas" class="flex items-center gap-2">
              <component :is="getIcon('FileCheck')" class="w-5 h-5 text-gray-600" />
              <span>{{ items.archivoAccionistas.nombre }}</span>
            </div>
            <span v-else>-</span>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell
            class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
          >
            Acuerdos de Terceros
          </TableCell>
          <TableCell
            class="font-secondary text-gray-600 dark:text-gray-900 t-t2 font-medium h-16"
          >
            <div v-if="items && items.archivoTerceros" class="flex items-center gap-2">
              <component :is="getIcon('FileCheck')" class="w-5 h-5 text-gray-600" />
              <span>{{ items.archivoTerceros.nombre }}</span>
            </div>
            <span v-else>-</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
