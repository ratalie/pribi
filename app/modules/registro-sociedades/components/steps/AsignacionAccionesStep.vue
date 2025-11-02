<script setup lang="ts">
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import OutLineCard from "~/components/base/cards/OutLineCard.vue";
  import SharesCard from "~/components/base/cards/SharesCard.vue";
  import AsignationTable from "~/components/base/tables/asignacion-acciones-table/AsignationTable.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  defineProps<Props>();

  const acciones = ref([
    { id: "1", nombre: "Comunes", acciones_asignadas: "100", acciones_suscritas: "1,000" },
    { id: "2", nombre: "Preferentes", acciones_asignadas: "200", acciones_suscritas: "5,000" },
    { id: "3", nombre: "Clase A", acciones_asignadas: "150", acciones_suscritas: "8,000" },
    { id: "4", nombre: "Clase B", acciones_asignadas: "100", acciones_suscritas: "2,000" },
  ]);

  const data = ref([
    {
      id: "1",
      accionista: "Carlos Andrés Ramírez Torres",
      tipos: "2 tipos",
      acciones: [
        { clase: "Clase A", acciones: 30, porcentaje: 10.5 },
        { clase: "Clase B", acciones: 20, porcentaje: 3.79 },
      ],
    },
    {
      id: "2",
      accionista: "María Fernanda López García",
      tipos: "1 tipo",
      acciones: [{ clase: "Comunes", acciones: 50, porcentaje: 5.0 }],
    },
    {
      id: "3",
      accionista: "Juan Pablo Martínez Sánchez",
      tipos: "3 tipos",
      acciones: [
        { clase: "Preferentes", acciones: 40, porcentaje: 4.0 },
        { clase: "Clase A", acciones: 25, porcentaje: 8.79 },
        { clase: "Clase B", acciones: 15, porcentaje: 2.5 },
      ],
    },
  ]);

  const actions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (itemId: string) => {
        console.log("Editar", itemId);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (itemId: string) => {
        console.log("Eliminar para:", itemId);
      },
    },
  ];
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
              <span class="font-bold">S/ 10.00</span>
            </p>
          </BaseButton>
        </div>
      </template>
    </CardTitle>

    <div class="flex gap-6 overflow-y-auto">
      <SharesCard
        v-for="accion in acciones"
        :key="accion.id"
        :clase-acciones="accion.nombre"
        :acciones-asignadas="accion.acciones_asignadas"
        :acciones-suscritas="accion.acciones_suscritas"
      />
    </div>

    <!-- cards de resumen -->
    <div class="grid grid-cols-3 gap-6">
      <OutLineCard title="Total de Acciones de la Sociedad" value="1,000" />
      <OutLineCard title="Total de Acciones Asignadas" value="1,000" />
      <OutLineCard title="Capital Social" value="S/ 1,000" />
    </div>

    <AsignationTable :data="data" :actions="actions" />
  </div>
</template>
