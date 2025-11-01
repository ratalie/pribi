<script setup lang="ts">
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import OutLineCard from "~/components/base/cards/OutLineCard.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  defineProps<Props>();

  interface ISharesholderTable {
    id: string;
    tipo_acciones: string;
    acciones_suscritas: number;
    participacion: string;
    derecho_voto: boolean;
    redimibles: boolean;
    derechos_especiales: boolean;
    obligaciones_adicionales: boolean;
  }

  const societyHeaders: TableColumn<ISharesholderTable>[] = [
    { key: "tipo_acciones", label: "Tipo de Acciones", type: "text" },
    { key: "acciones_suscritas", label: "Acciones Suscritas", type: "text" },
    { key: "participacion", label: "Participación", type: "text" },
    { key: "derecho_voto", label: "Derecho a Voto", type: "icons", icons: ["Check", "X"] },
    { key: "redimibles", label: "Redimibles", type: "icons", icons: ["Check", "X"] },
    {
      key: "derechos_especiales",
      label: "Derechos Especiales",
      type: "icons",
      icons: ["FileCheck", "X"],
    },
    {
      key: "obligaciones_adicionales",
      label: "Obligaciones Adicionales",
      type: "icons",
      icons: ["FileCheck", "X"],
    },
  ];

  const columns = getColumns(societyHeaders);
  const data = ref<ISharesholderTable[]>([
    {
      id: "1",
      tipo_acciones: "Comunes",
      acciones_suscritas: 1000,
      participacion: "50%",
      derecho_voto: true,
      redimibles: false,
      derechos_especiales: false,
      obligaciones_adicionales: false,
    },
    {
      id: "2",
      tipo_acciones: "Preferentes",
      acciones_suscritas: 1000,
      participacion: "50%",
      derecho_voto: false,
      redimibles: true,
      derechos_especiales: true,
      obligaciones_adicionales: true,
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
  <div class="h-full w-full p-14 flex flex-col gap-12">
    <CardTitle title="Capital Social y Acciones" body="Complete todos los campos requeridos.">
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

          <!-- agregar -->
          <ActionButton variant="secondary" label="Agregar" size="md" icon="Plus" />
        </div>
      </template>
    </CardTitle>

    <!-- cards de resumen -->
    <div class="grid grid-cols-3 gap-6">
      <OutLineCard title="Total de acciones de la sociedad" value="1000" />
      <OutLineCard title="Cantidad de Tipo de Acciones" value="1000" />
      <OutLineCard title="Capital Social" value="S/ 1000" />
    </div>

    <SimpleTable :columns="columns" :data="data" title-menu="Actions" :actions="actions" />
  </div>
</template>
