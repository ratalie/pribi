<script setup lang="ts">
  import { ArrowDown, ArrowUp } from "lucide-vue-next";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table";

  interface Props {
    listaAntes: any[];
    listaDespues: any[];
  }

  const props = defineProps<Props>();

  const switchTabs = ref<"opcion-a" | "opcion-b">("opcion-a");

  const listaAportantes = computed(() => {
    return switchTabs.value === "opcion-a" ? props.listaAntes : props.listaDespues;
  });

  /**
   * Calcula el cambio de porcentaje y determina el estilo
   * Solo aplica cuando estamos en la vista "después"
   */
  const getCambioPorcentaje = (item: any) => {
    // Solo mostrar cambio en la vista "después"
    if (switchTabs.value === "opcion-a" || !item.porcentajeAntes) {
      return null;
    }

    const porcentajeActual = parseFloat(item.porcentajeParticipacion.replace("%", ""));
    const diferencia = porcentajeActual - item.porcentajeAntes;

    // Si no hay cambio significativo (menos de 0.01%), no mostrar
    if (Math.abs(diferencia) < 0.01) {
      return null;
    }

    return {
      diferencia,
      subio: diferencia > 0,
      bajo: diferencia < 0,
    };
  };
</script>

<template>
  <div class="w-full flex flex-col gap-12">
    <div class="w-full grid grid-cols-[250px_1fr] gap-4 font-primary">
      <p class="t-h5 font-semibold text-gray-800">Distribución accionionaria</p>

      <SwitchTabsText
        v-model="switchTabs"
        opcion-a="Antes del Aporte"
        opcion-b="Después del aporte"
        size="sm"
      />
    </div>

    <Table>
      <TableHeader>
        <TableRow class="h-12">
          <TableHead class="font-primary text-gray-800 t-t2 font-semibold text-center">
            Nombre Apellido / Razón Social
          </TableHead>
          <TableHead class="font-primary text-gray-800 t-t2 font-semibold text-center">
            Tipo de Aportante
          </TableHead>
          <TableHead class="font-primary text-gray-800 t-t2 font-semibold text-center">
            Nº de Acciones
          </TableHead>
          <TableHead class="font-primary text-gray-800 t-t2 font-semibold text-center">
            % Participación
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-for="aportantes in listaAportantes" :key="aportantes.id">
          <TableRow class="h-16">
            <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
              {{ aportantes.nombre }}
            </TableCell>
            <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
              <div class="flex items-center justify-center">
                <div
                  :class="{
                    'border-primary-700 text-primary-700': aportantes.esAccionista,
                    'border-primary-600 text-primary-600': !aportantes.esAccionista,
                  }"
                  class="border border-solid px-3 py-1.5 rounded-[54px] shrink-0"
                >
                  <p
                    :class="{
                      'text-primary-700': aportantes.esAccionista,
                      'text-primary-600': !aportantes.esAccionista,
                    }"
                    class="font-secondary font-semibold text-[11px] leading-[16px] text-center uppercase"
                  >
                    {{ aportantes.esAccionista ? "ACCIONISTA" : "NUEVO APORTANTE" }}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
              {{ aportantes.numeroAcciones }}
            </TableCell>
            <TableCell class="font-secondary text-gray-700 t-t2 font-medium text-center">
              <div class="flex items-center justify-center gap-[2px]">
                <template v-if="getCambioPorcentaje(aportantes)">
                  <!-- Flecha hacia abajo (bajó) -->
                  <ArrowDown
                    v-if="getCambioPorcentaje(aportantes)?.bajo"
                    class="w-[14px] h-[14px] text-red-500 shrink-0"
                  />
                  <!-- Flecha hacia arriba (subió) -->
                  <ArrowUp
                    v-else-if="getCambioPorcentaje(aportantes)?.subio"
                    class="w-[14px] h-[14px] text-[#00b600] shrink-0"
                  />
                </template>
                <p
                  :class="{
                    'font-bold text-red-500': getCambioPorcentaje(aportantes)?.bajo,
                    'font-bold text-[#00b600]': getCambioPorcentaje(aportantes)?.subio,
                    'font-medium text-gray-700': !getCambioPorcentaje(aportantes),
                  }"
                  class="text-[14px] leading-[18px] text-center"
                >
                  {{ aportantes.porcentajeParticipacion }}
                </p>
              </div>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
