<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
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
    name: string;
    person_type: string;
    document_type: string;
    document_number: string;
  }

  const societyHeaders: TableColumn<ISharesholderTable>[] = [
    { key: "name", label: "Nombres y Apellidos/ Razón Social", type: "text" },
    { key: "person_type", label: "Tipo de Persona", type: "text" },
    { key: "document_type", label: "Tipo de Documento", type: "text" },
    { key: "document_number", label: "N° de Documento", type: "text" },
  ];

  const columns = getColumns(societyHeaders);
  const data = ref<ISharesholderTable[]>([
    {
      id: "1",
      name: "Juan Perez",
      person_type: "Natural",
      document_type: "DNI",
      document_number: "12345678",
    },
    {
      id: "2",
      name: "Empresa XYZ S.A.",
      person_type: "Jurídica",
      document_type: "RUC",
      document_number: "20123456789",
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
  <div class="h-full p-14 flex flex-col gap-12">
    <CardTitle title="Accionistas" body="Complete todos los campos requeridos.">
      <template #actions>
        <ActionButton variant="secondary" label="Agregar" size="md" icon="Plus" />
      </template>
    </CardTitle>

    <SimpleTable :columns="columns" :data="data" title-menu="Actions" :actions="actions" />
  </div>
</template>
