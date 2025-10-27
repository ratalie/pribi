<script setup lang="ts">
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import RucInput from "~/components/base/inputs/text/custom/RucInput.vue";
  import SelectInput from "~/components/base/inputs/text/ui/SelectInput.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import CheckboxTable from "~/components/base/tables/checkbox-table/CheckboxTable.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import { razonSocialSchema } from "~/modules/registro-sociedades/schemas/datosSociedad";
  import { ItemStateEnum } from "~/types/enums/ItemStateEnum";

  //tabla simple
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

  const columns = getColumns(societyHeaders);
  const data = ref<ISocietyTable[]>([
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
  ]);

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

  //tabla con checkboxs
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

  const columnsChecked = getColumns(assistanceHeaders);
  const dataChecked = ref<IAssistanceTable[]>([
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
  ]);

  const handleAllCheckedItems = (value: boolean) => {
    dataChecked.value.forEach((item) => {
      item.checked = value;
    });
  };

  //zod input
  const form = ref({
    razonSocial: "",
    numeroRuc: "",
    oficinaRegistral: "",
  });

  const options = [
    { id: 1, acronimo: "LIM", name: "Lima", label: "Lima", value: "lima" },
    { id: 2, acronimo: "ARE", name: "Arequipa", label: "Arequipa", value: "arequipa" },
    { id: 3, acronimo: "CUS", name: "Cusco", label: "Cusco", value: "cusco" },
  ];
</script>

<template>
  <div class="flex flex-col gap-10">
    <p class="text-primary font-bold t-h5">Lista de Componentes</p>

    <div class="flex flex-col gap-4">
      <p class="text-primary font-bold t-h6">Tabla Simple</p>
      <SimpleTable :columns="columns" :data="data" title-menu="Actions" :actions="actions" />
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-primary font-bold t-h6">Tabla Checkboxs</p>
      <CheckboxTable
        :columns="columnsChecked"
        :data="dataChecked"
        title-menu="Actions"
        :actions="actions"
        @update:checked-items="handleAllCheckedItems"
      />
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-primary font-bold t-h6">Lista de botones</p>
      <div class="flex gap-4">
        <ActionButton label="Descargar" size="md" icon="Download" :is-loading="true" />
        <ActionButton label="Descargar" size="md" icon="Download" />
        <ActionButton label="Agregar Sociedad" size="lg" icon="Plus" />
        <ActionButton label="Siguiente" size="md" variant="primary_outline" />
        <ActionButton label="Agregar" size="sm" variant="secondary" />
        <ActionButton
          label="Guardar y continuar"
          size="xl"
          variant="secondary_outline"
          icon="ArrowRight"
          icon-position="right"
        />
      </div>
      <div>
        <BaseButton variant="secondary">Botón Compuesto</BaseButton>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-primary font-bold t-h6">Lista de botones</p>

      <div class="flex flex-col gap-8">
        <RucInput
          v-model="form.numeroRuc"
          label="Input de busqueda"
          label-id="busqueda"
          placeholder="Ingrese el número a buscar"
          :required="true"
          :show-search-icon="true"
          icon-position="right"
          @validation="() => {}"
        />

        <SelectInput
          v-model="form.oficinaRegistral"
          label="Input de selección"
          :options="options"
          :required="true"
          placeholder="Elige una opción"
          @validation="() => {}"
        />

        <TextInputZod
          v-model="form.razonSocial"
          name="input de texto"
          label="Input de texto"
          placeholder="Ingrese Texto"
          :schema="razonSocialSchema"
        />
      </div>
    </div>
  </div>
</template>
