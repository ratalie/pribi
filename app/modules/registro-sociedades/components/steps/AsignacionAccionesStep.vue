<script setup lang="ts">
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import OutLineCard from "~/components/base/cards/OutLineCard.vue";
  import SharesCard from "~/components/base/cards/SharesCard.vue";
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

  const _actions = [
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
  <div class="h-full w-full p-14 flex flex-col gap-12">
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
  </div>
</template>
