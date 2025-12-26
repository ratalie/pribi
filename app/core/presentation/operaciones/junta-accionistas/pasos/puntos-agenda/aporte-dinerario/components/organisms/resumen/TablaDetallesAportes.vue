<script setup lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table";
  import type { AportanteConDetalles } from "~/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useLoadDataFlowAD";

  interface Props {
    aportantes: AportanteConDetalles[];
  }

  const props = defineProps<Props>();

  /**
   * Formatea un monto en soles (S/)
   */
  const formatMontoSoles = (monto: number): string => {
    return `S/ ${monto.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /**
   * Formatea el monto en otra moneda
   * Si es null, retorna "$ 0"
   */
  const formatMontoOtraMoneda = (monto: number | null): string => {
    if (monto === null || monto === 0) {
      return "$ 0";
    }
    return `$ ${monto.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <div class="w-full flex items-start">
      <p class="t-h5 font-semibold text-gray-800">Detalles de los Aportes Dinerarios</p>
    </div>

    <div
      v-for="aportante in props.aportantes"
      :key="aportante.id"
      class="w-full flex flex-col gap-4"
    >
      <!-- Nombre del aportante -->
      <p class="font-primary font-semibold text-[16px] leading-[18px] text-gray-700">
        {{ aportante.nombre }}
      </p>

      <!-- Tabla de detalles del aportante -->
      <div class="bg-white p-4 border border-gray-100 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow class="h-[70px]">
              <TableHead class="font-primary text-gray-800 text-[12px] font-bold text-center">
                Fecha
              </TableHead>
              <TableHead class="font-primary text-gray-800 text-[12px] font-bold text-center">
                Tipo de Acción
              </TableHead>
              <TableHead class="font-primary text-gray-800 text-[12px] font-bold text-center">
                Monto
              </TableHead>
              <TableHead class="font-primary text-gray-800 text-[12px] font-bold text-center">
                Monto en otra Moneda
              </TableHead>
              <TableHead class="font-primary text-gray-800 text-[12px] font-bold text-center">
                Capital Social
              </TableHead>
              <TableHead class="font-primary text-gray-800 text-[12px] font-bold text-center">
                Prima
              </TableHead>
              <TableHead
                class="font-primary text-gray-800 text-[12px] font-bold text-center min-w-[109px]"
              >
                Precio pagado por Acción
              </TableHead>
              <TableHead
                class="font-primary text-gray-800 text-[12px] font-bold text-center min-w-[109px]"
              >
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(aporte, index) in aportante.aportes"
              :key="`${aportante.id}-${index}`"
              class="h-[70px]"
            >
              <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                {{ aporte.fecha }}
              </TableCell>
              <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                {{ aporte.tipoAccion }}
              </TableCell>
              <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                {{ formatMontoSoles(aporte.monto) }}
              </TableCell>
              <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                {{ formatMontoOtraMoneda(aporte.montoEnOtraMoneda) }}
              </TableCell>
              <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                {{ formatMontoSoles(aporte.capitalSocial) }}
              </TableCell>
              <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                {{ formatMontoSoles(aporte.prima) }}
              </TableCell>
              <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                {{ formatMontoSoles(aporte.precioPorAccion) }}
              </TableCell>
              <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
                {{ aporte.acciones.toLocaleString("es-PE") }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
