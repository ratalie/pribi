<script setup lang="ts">
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import OutLineCard from "~/components/base/cards/OutLineCard.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import SharesCard from "./components/SharesCard.vue";
  import AsignationTable from "./components/tables/AsignationTable.vue";
  import { useAsignacionAccionesComputed } from "./composables/useAsignacionAccionesComputed";
  import { useAsignacionAccionesLoader } from "./composables/useAsignacionAccionesLoader";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  const props = defineProps<Props>();

  // Cargar datos desde el backend
  useAsignacionAccionesLoader({
    societyId: props.societyId,
  });

  const {
    accionesDisponibles,
    totalAccionesAsignadasDisplay,
    totalAccionesSociedadDisplay,
    capitalSocialDisplay,
    valorNominalDisplay,
  } = useAsignacionAccionesComputed();
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle
      title="Asignación de Acciones"
      body="Distribuye las acciones entre los accionistas."
    >
      <template #actions>
        <div class="flex gap-4">
          <!-- valor nominal -->
          <BaseButton variant="pill" class="h-11">
            <img :src="IconCoin" alt="Valor Nominal" />
            <p class="font-bold">
              Valor Nominal:
              <span class="font-bold">{{ valorNominalDisplay }}</span>
            </p>
          </BaseButton>
        </div>
      </template>
    </CardTitle>

    <div v-if="accionesDisponibles.length > 0" class="flex gap-6 overflow-y-auto">
      <SharesCard
        v-for="accion in accionesDisponibles"
        :key="accion.id"
        :clase-acciones="accion.nombre"
        :acciones-asignadas="accion.accionesAsignadas.toLocaleString('es-PE')"
        :acciones-suscritas="accion.accionesSuscritas.toLocaleString('es-PE')"
      />
    </div>
    <div
      v-else
      class="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p class="text-gray-500 text-center">
        No hay tipos de acciones creados. Por favor, crea al menos un tipo de acción para
        continuar.
      </p>
    </div>

    <!-- cards de resumen -->
    <div class="grid grid-cols-3 gap-6">
      <OutLineCard
        title="Total de Acciones de la Sociedad"
        :value="totalAccionesSociedadDisplay"
      />
      <OutLineCard
        title="Total de Acciones Asignadas"
        :value="totalAccionesAsignadasDisplay"
      />
      <OutLineCard title="Capital Social" :value="capitalSocialDisplay" />
    </div>

    <AsignationTable />
  </div>
</template>
