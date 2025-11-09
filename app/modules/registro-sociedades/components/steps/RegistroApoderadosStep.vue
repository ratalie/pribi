<script setup lang="ts">
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import ClaseApoderadoModal from "../modals/ClaseApoderadoModal.vue";
  import RegistroApoderadoModal from "../modals/RegistroApoderadoModal.vue";
  import RegistroOtroApoderadoModal from "../modals/RegistroOtroApoderadoModal.vue";

  interface Props {
    societyId?: string;
  }

  interface ApoderadoRow {
    id: string;
    clase_apoderado: string;
    numero_apoderados: number;
  }

  interface RegistroApoderadoRow {
    id: string;
    clase_apoderado: string;
    nombre_razon_social: string;
    tipo_documento: string;
    numero_documento: string;
  }

  interface OtrosApoderadosRow {
    id: string;
    nombre_razon_social: string;
    tipo_documento: string;
    numero_documento: string;
  }

  defineProps<Props>();

  // Primera tabla - Clase de Apoderados
  const apoderadosColumns: TableColumn<ApoderadoRow>[] = [
    { key: "id", label: "ID", type: "text" },
    { key: "clase_apoderado", label: "Clase de Apoderado", type: "text" },
    { key: "numero_apoderados", label: "No. de apoderados", type: "text" },
  ];

  const columns = getColumns(apoderadosColumns);

  const apoderadosData = ref<ApoderadoRow[]>([
    {
      id: "1",
      clase_apoderado: "Gerente General",
      numero_apoderados: 0,
    },
    {
      id: "2",
      clase_apoderado: "Otro apoderados",
      numero_apoderados: 0,
    },
    {
      id: "3",
      clase_apoderado: "Apoderado de Grupo",
      numero_apoderados: 2,
    },
  ]);

  // Segunda tabla - Registro de Apoderados
  const registroApoderadosColumns: TableColumn<RegistroApoderadoRow>[] = [
    { key: "clase_apoderado", label: "Clase de Apoderado", type: "text" },
    { key: "nombre_razon_social", label: "Nombre/Razón social", type: "text" },
    { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
    { key: "numero_documento", label: "No. de Documento", type: "text" },
  ];

  const registroColumns = getColumns(registroApoderadosColumns);

  const registroApoderadosData = ref<RegistroApoderadoRow[]>([
    {
      id: "1",
      clase_apoderado: "Gerente General",
      nombre_razon_social: "Juan Perez Lopez",
      tipo_documento: "DNI",
      numero_documento: "71641140",
    },
    {
      id: "2",
      clase_apoderado: "Apoderado de Grupo A",
      nombre_razon_social: "Ana Gomez Fernandez",
      tipo_documento: "DNI",
      numero_documento: "71641150",
    },
    {
      id: "3",
      clase_apoderado: "Apoderado de Grupo B",
      nombre_razon_social: "Cristian Quispe Perez",
      tipo_documento: "DNI",
      numero_documento: "71641160",
    },
  ]);

  const actions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (id: string) => {
        console.log("Editar", id);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (id: string) => {
        console.log("Eliminar", id);
      },
    },
  ];

  // Tercera tabla - Otros Apoderados
  const otrosApoderadosColumns: TableColumn<OtrosApoderadosRow>[] = [
    { key: "nombre_razon_social", label: "Nombre/Razón social", type: "text" },
    { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
    { key: "numero_documento", label: "No. de Documento", type: "text" },
  ];

  const otrosApoderadosColumnsDef = getColumns(otrosApoderadosColumns);

  const otrosApoderadosData = ref<OtrosApoderadosRow[]>([
    {
      id: "1",
      nombre_razon_social: "Maria Fernanda Torres",
      tipo_documento: "DNI",
      numero_documento: "71641141",
    },
    {
      id: "2",
      nombre_razon_social: "Carlos Alberto Rojas",
      tipo_documento: "Carnet Extranejeria",
      numero_documento: "CE-456789",
    },
  ]);

  const showActionsFor = (row: ApoderadoRow) => {
    return row.numero_apoderados > 0;
  };
  const isModalOpenClaseApoderado = ref(false);
  const isModalOpenRegistroApoderado = ref(false);
  const isModalOpenRegistroOtroApoderado = ref(false);

  const openModalClaseApoderado = () => {
    isModalOpenClaseApoderado.value = true;
  };

  const closeModalClaseApoderado = () => {
    isModalOpenClaseApoderado.value = false;
  };

  const openModalRegistroApoderado = () => {
    isModalOpenRegistroApoderado.value = true;
  };

  const closeModalRegistroApoderado = () => {
    isModalOpenRegistroApoderado.value = false;
  };

  const openModalRegistroOtroApoderado = () => {
    isModalOpenRegistroOtroApoderado.value = true;
  };

  const closeModalRegistroOtroApoderado = () => {
    isModalOpenRegistroOtroApoderado.value = false;
  };

  const handleSubmitClaseApoderado = (data: any) => {
    console.log("data", data);
  };
  const handleSubmitRegistroApoderado = (data: any) => {
    console.log("data", data);
  };
  const handleSubmitRegistroOtroApoderado = (data: any) => {
    console.log("data", data);
  };
</script>

<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle title="Registro de Apoderados" body="Complete todos los campos requeridos." />
    <SimpleCard>
      <CardTitle title="Clase de Apoderados" body="">
        <template #actions>
          <ActionButton
            variant="secondary"
            label="Agregar Clase de Apoderado"
            size="xl"
            icon="Plus"
            @click="openModalClaseApoderado"
          />
        </template>
      </CardTitle>
      <SimpleTable
        :columns="columns"
        :data="apoderadosData"
        title-menu="Acciones"
        :actions="actions"
        :show-actions-for="showActionsFor"
      />
    </SimpleCard>

    <SimpleCard>
      <CardTitle title="Registro de Apoderados" body="">
        <template #actions>
          <ActionButton
            variant="secondary"
            label="Agregar Apoderado"
            size="xl"
            icon="Plus"
            @click="openModalRegistroApoderado"
          />
        </template>
      </CardTitle>
      <SimpleTable
        :columns="registroColumns"
        :data="registroApoderadosData"
        title-menu="Acciones"
        :actions="actions"
      />
    </SimpleCard>

    <SimpleCard>
      <CardTitle title="Otros Apoderados" body="">
        <template #actions>
          <ActionButton
            variant="secondary"
            label="Agregar Otro Apoderado"
            size="xl"
            icon="Plus"
            @click="openModalRegistroOtroApoderado"
          />
        </template>
      </CardTitle>
      <SimpleTable
        :columns="otrosApoderadosColumnsDef"
        :data="otrosApoderadosData"
        title-menu="Acciones"
        :actions="actions"
      />
    </SimpleCard>

    <ClaseApoderadoModal
      v-if="isModalOpenClaseApoderado"
      v-model="isModalOpenClaseApoderado"
      mode="crear"
      @close="closeModalClaseApoderado"
      @submit="handleSubmitClaseApoderado($event)"
    />
    <RegistroApoderadoModal
      v-if="isModalOpenRegistroApoderado"
      v-model="isModalOpenRegistroApoderado"
      mode="crear"
      @close="closeModalRegistroApoderado"
      @submit="handleSubmitRegistroApoderado($event)"
    />
    <RegistroOtroApoderadoModal
      v-if="isModalOpenRegistroOtroApoderado"
      v-model="isModalOpenRegistroOtroApoderado"
      mode="crear"
      @close="closeModalRegistroOtroApoderado"
      @submit="handleSubmitRegistroOtroApoderado($event)"
    />
  </div>
</template>
