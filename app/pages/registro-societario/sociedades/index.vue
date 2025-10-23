<script setup lang="ts">
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import { ItemStateEnum } from "~/types/enums/ItemStateEnum";

  useHead({
    title: "Sociedades - PROBO",
  });

  export interface ISocietyTable {
    id: string;
    razon_social: string;
    ruc: string;
    nombre_comercial: string;
    tipo_sociedad: string;
    estado: ItemStateEnum;
  }

  const societyHeaders: TableColumn<ISocietyTable>[] = [
    { key: "razon_social", label: "Razón Social", type: "text" },
    { key: "ruc", label: "RUC", type: "text" },
    { key: "nombre_comercial", label: "Nombre Comercial", type: "text" },
    { key: "tipo_sociedad", label: "Tipo de Sociedad", type: "text" },
    { key: "estado", label: "Estado", type: "status" },
  ];

  const actions = [
    {
      label: "Detalles",
      onClick: (itemId: string) => {
        console.log("Ver detalles de:", itemId);
      },
    },
    {
      label: "Ver resumen",
      separatorLine: true,
      onClick: (itemId: string) => {
        console.log("Ver resumen de:", itemId);
      },
    },
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

  const columns = getColumns(societyHeaders);
  const data = ref<ISocietyTable[]>([]);

  async function getData(): Promise<ISocietyTable[]> {
    return [
      {
        id: "uuid-1",
        razon_social: "BANCO BBVA PERU",
        ruc: "12345678901",
        nombre_comercial: "Comercial 1",
        tipo_sociedad: "Sociedad Anónima",
        estado: ItemStateEnum.COMPLETADO,
      },
      {
        id: "uuid-2",
        razon_social: "SHALOM EMPRESARIAL S.A.C.",
        ruc: "10987654321",
        nombre_comercial: "Comercial 2",
        tipo_sociedad: "Sociedad Limitada",
        estado: ItemStateEnum.PENDIENTE,
      },
    ];
  }

  onMounted(async () => {
    data.value = await getData();
  });
</script>

<template>
  <div>
    <PageTitle title-key="pages.sociedades" />

    <SimpleTable :columns="columns" :data="data" title-menu="Actions" :actions="actions" />
  </div>
</template>
