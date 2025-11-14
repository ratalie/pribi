<script setup lang="ts">
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import FileUploadDragDrop from "~/components/base/inputs/FileUploadDragDrop.vue";
  import FileUploadDragDropMultiple from "~/components/base/inputs/FileUploadDragDropMultiple.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import SwitchTabs from "~/components/base/Switch/SwitchTabs.vue";
  import CheckboxTable from "~/components/base/tables/checkbox-table/CheckboxTable.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import {
    razonSocialSchema,
    rucSchema,
    tipoSociedadSchema,
  } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/schemas";
  import { ItemStateEnum } from "~/types/enums/ItemStateEnum";

  const uploadedFile = ref<File | null>(null);
  const uploadedFiles = ref<File[]>([]);

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
    tipoSociedad: "",
    numeroRuc: "",
    oficinaRegistral: "",
  });

  const isLoading = ref(false);
  const isActive = ref(true);

  const handleSearch = (numberDoc: string) => {
    isLoading.value = true;

    setTimeout(() => {
      console.log("Datos encontrados:", numberDoc);
      isLoading.value = false;
    }, 1500);
  };

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
        <SearchInputZod
          v-model="form.numeroRuc"
          name="input-de-busqueda"
          label="Input de búsqueda"
          placeholder="Ingrese el número a buscar"
          :schema="rucSchema"
          :is-loading="isLoading"
          @search="handleSearch"
        />

        <SelectInputZod
          v-model="form.tipoSociedad"
          :options="options"
          name="input-de-selección"
          label="Input de selección"
          placeholder="Seleccione una opción"
          :schema="tipoSociedadSchema"
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

    <div class="flex flex-col gap-4">
      <!-- Ejemplo 2: Con un botón -->
      <CardTitle
        title="Datos principales"
        body="Complete todos los datos requeridos."
        class="mb-8"
      >
        <template #actions>
          <BaseButton variant="primary" size="md">Guardar</BaseButton>
        </template>
      </CardTitle>

      <!-- Ejemplo 3: Con un icono (descomenta para usar) -->
      <CardTitle
        title="Datos principales"
        body="Complete todos los datos requeridos."
        class="mb-8"
      >
        <template #actions>
          <button
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </template>
      </CardTitle>

      <!-- Ejemplo 6: Con badge pegado al título -->
      <CardTitle
        title="Datos principales"
        body="Complete todos los datos requeridos."
        class="mb-8"
      >
        <template #switch>
          <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            Nuevo
          </span>
        </template>
        <template #actions>
          <BaseButton variant="primary" size="md">Guardar</BaseButton>
        </template>
      </CardTitle>

      <!-- Ejemplo 7: Solo con switch, sin actions -->
      <CardTitle
        title="Datos principales"
        body="Active o desactive esta sección."
        class="mb-8"
      >
        <template #switch>
          <Switch v-model:checked="isActive" />
        </template>
      </CardTitle>
    </div>

    <div class="flex flex-col gap-4">
      <!-- Ejemplo 1: DEFAULT - Grande con título -->
      <FileUploadDragDrop
        v-model="uploadedFile"
        title="Subir documento"
        subtitle="Arrastra tu archivo o haz clic para seleccionarlo"
        variant="default"
        format-description=".docx, .pdf (max 5 MB)"
      />

      <!-- Ejemplo 2: COMPACT - Mediano sin título -->
      <FileUploadDragDrop
        v-model="uploadedFile"
        variant="compact"
        click-message="Cargar archivo"
        drag-message="o arrastra aquí"
      />

      <!-- Ejemplo 3: INLINE - Horizontal compacto -->
      <FileUploadDragDrop
        v-model="uploadedFile"
        variant="inline"
        click-message="Adjuntar"
        :hide-description="true"
      />

      <!-- Ejemplo 4: Múltiples archivos -->
      <FileUploadDragDropMultiple
        v-model="uploadedFiles"
        title="Subir múltiples documentos"
        subtitle="Puedes adjuntar varios archivos a la vez"
        :max-files="10"
        :max-size-m-b="5"
      />
    </div>

    <SimpleSwitchYesNo />

    <div class="flex flex-col gap-4">
      <p class="text-primary font-bold t-h6">SwitchTabs - Variantes</p>

      <!-- Variante Default -->
      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-600">Variante Default (gris)</p>
        <SwitchTabs opcion-a="El Directorio" opcion-b="La Junta de Accionistas">
          <template #opcion-a>
            <div>EL DIRECTORIO</div>
          </template>
          <template #opcion-b>
            <div>LA JUNTA DE ACCIONISTAS</div>
          </template>
        </SwitchTabs>
      </div>

      <!-- Variante Primary -->
      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-600">Variante Primary (azul)</p>
        <SwitchTabs
          opcion-a="El Directorio"
          opcion-b="La Junta de Accionistas"
          variant="primary"
        >
          <template #opcion-a>
            <div>EL DIRECTORIO</div>
          </template>
          <template #opcion-b>
            <div>LA JUNTA DE ACCIONISTAS</div>
          </template>
        </SwitchTabs>
      </div>
    </div>
  </div>
</template>
