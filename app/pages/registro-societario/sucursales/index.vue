<script setup lang="ts">
  import CheckboxTable from "~/components/base/tables/checkbox-table/CheckboxTable.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";

  useHead({
    title: "Sucursales - PROBO",
  });

  export interface IAssistanceTable {
    id: string;
    checked: boolean;
    name: string;
    shares: string;
    percent: string;
    represent_by: string;
  }

  const assistanceHeaders: TableColumn<IAssistanceTable>[] = [
    { key: "name", label: "Nombre/Razón Social", type: "text" },
    { key: "shares", label: "Acciones", type: "text" },
    { key: "percent", label: "Porcentaje", type: "text" },
    { key: "represent_by", label: "Representado por", type: "text" },
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

  const columns = getColumns(assistanceHeaders);
  const data = ref<IAssistanceTable[]>([]);

  async function getData(): Promise<IAssistanceTable[]> {
    return [
      {
        id: "uuid-1",
        checked: false,
        name: "EMPRESA COMERCIAL S.A.C.",
        shares: "5000",
        percent: "50%",
        represent_by: "Juan Perez",
      },
      {
        id: "uuid-2",
        checked: false,
        name: "INDUSTRIAS TEXTILES S.A.C.",
        shares: "3000",
        percent: "30%",
        represent_by: "Maria Lopez",
      },
    ];
  }

  const handleAllCheckedItems = (value: boolean) => {
    data.value.forEach((item) => {
      item.checked = value;
    });
  };

  onMounted(async () => {
    data.value = await getData();
  });
</script>

<template>
  <div>
    <PageTitle title-key="pages.sucursales" />

    <CheckboxTable
      :columns="columns"
      :data="data"
      title-menu="Actions"
      :actions="actions"
      @update:checked-items="handleAllCheckedItems"
    />
  </div>
</template>
