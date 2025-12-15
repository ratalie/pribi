<template>
  <SlotWrapper>
    <TitleH2
      title="Designación"
      subtitle="Registra los apoderados propuestos y su información clave."
    />

    <div class="flex flex-col gap-10">
      <!-- Tabla de Apoderados -->
      <SimpleCard>
        <CardTitle title="Registro de Apoderados" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar apoderado"
              size="lg"
              icon="Plus"
              :disabled="claseOptions.length === 0"
              @click="openModalApoderado"
            />
          </template>
        </CardTitle>

        <NombramientoApoderadosTable :items="apoderados" :actions="apoderadoActions" />
      </SimpleCard>

      <!-- Tabla de Otros Apoderados -->
      <SimpleCard>
        <CardTitle title="Registro de Otros Apoderados" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar apoderado"
              size="lg"
              icon="Plus"
              @click="openModalOtroApoderado"
            />
          </template>
        </CardTitle>

        <NombramientoOtrosApoderadosTable
          :items="otrosApoderados"
          :actions="otroApoderadoActions"
        />
      </SimpleCard>

      <!-- Modal para Apoderados -->
      <RegistroApoderadoModal
        v-model="isOpenModalApoderado"
        v-model:clase-apoderado-id="selectedClaseId"
        :mostrar-selector-clase="mostrarSelectorClase"
        :mode="modeModalApoderado"
        :is-saving="isLoadingApoderado"
        :clase-options="claseOptions"
        @close="handleCloseModalApoderado"
        @submit="handleSubmitApoderado"
      />

      <!-- Modal para Otros Apoderados -->
      <RegistroApoderadoModal
        v-model="isOpenModalOtroApoderado"
        v-model:clase-apoderado-id="selectedClaseIdOtros"
        :mostrar-selector-clase="false"
        :mode="modeModalOtroApoderado"
        :is-saving="isLoadingOtroApoderado"
        :clase-options="claseOptions"
        @close="handleCloseModalOtroApoderado"
        @submit="handleSubmitOtroApoderado"
      />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import RegistroApoderadoModal from "~/core/presentation/registros/sociedades/pasos/apoderados/components/modals/RegistroApoderadoModal.vue";
  import { ClasesApoderadoEspecialesEnum } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/enums/ClasesApoderadoEspecialesEnum";
  import type { ApoderadoRow } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/types";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
  import NombramientoApoderadosTable from "./components/NombramientoApoderadosTable.vue";
  import NombramientoOtrosApoderadosTable from "./components/NombramientoOtrosApoderadosTable.vue";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ========== ESTADO LOCAL PARA APODERADOS ==========
  const apoderados = ref<ApoderadoRow[]>([
    {
      id: "apod-1",
      claseApoderadoNombre: "Apoderado Especial",
      nombre: "Juan Pérez García",
      tipoDocumento: TipoDocumentosEnum.DNI,
      numeroDocumento: "12345678",
    },
  ]);

  // ========== ESTADO LOCAL PARA OTROS APODERADOS ==========
  const otrosApoderados = ref<ApoderadoRow[]>([
    {
      id: "otro-apod-1",
      claseApoderadoNombre: "Otros Apoderados",
      nombre: "María López Sánchez",
      tipoDocumento: TipoDocumentosEnum.DNI,
      numeroDocumento: "87654321",
    },
  ]);

  // ========== CLASES DE APODERADO (EJEMPLO) ==========
  const claseOptions = ref([
    { id: "clase-1", value: "clase-1", label: "Apoderado Especial" },
    { id: "clase-2", value: "clase-2", label: "Apoderado Judicial" },
    { id: "clase-3", value: "clase-3", label: "Apoderado Comercial" },
  ]);

  // ========== STORE PARA EL FORMULARIO ==========
  const personaNaturalStore = usePersonaNaturalStore();

  // ========== ESTADO DEL MODAL PARA APODERADOS ==========
  const isOpenModalApoderado = ref(false);
  const modeModalApoderado = ref<"crear" | "editar">("crear");
  const isLoadingApoderado = ref(false);
  const selectedClaseId = ref("");
  const mostrarSelectorClase = ref(true);
  const editingApoderadoId = ref<string | null>(null);

  // ========== ESTADO DEL MODAL PARA OTROS APODERADOS ==========
  const isOpenModalOtroApoderado = ref(false);
  const modeModalOtroApoderado = ref<"crear" | "editar">("crear");
  const isLoadingOtroApoderado = ref(false);
  const selectedClaseIdOtros = ref("");
  const editingOtroApoderadoId = ref<string | null>(null);

  // ========== HANDLERS PARA APODERADOS ==========
  const openModalApoderado = () => {
    mostrarSelectorClase.value = true;
    selectedClaseId.value = "";
    editingApoderadoId.value = null;
    modeModalApoderado.value = "crear";
    personaNaturalStore.$reset();
    isOpenModalApoderado.value = true;
  };

  const handleCloseModalApoderado = () => {
    isOpenModalApoderado.value = false;
    modeModalApoderado.value = "crear";
    selectedClaseId.value = "";
    mostrarSelectorClase.value = true;
    editingApoderadoId.value = null;
    personaNaturalStore.$reset();
  };

  const handleSubmitApoderado = () => {
    if (!selectedClaseId.value) {
      handleCloseModalApoderado();
      return;
    }

    const claseSeleccionada = claseOptions.value.find((c) => c.id === selectedClaseId.value);
    if (!claseSeleccionada) {
      handleCloseModalApoderado();
      return;
    }

    const nombreCompleto = `${personaNaturalStore.nombre} ${
      personaNaturalStore.apellidoPaterno
    } ${personaNaturalStore.apellidoMaterno || ""}`.trim();

    if (modeModalApoderado.value === "crear") {
      const nuevoApoderado: ApoderadoRow = {
        id: `apod-${Math.random().toString(36).slice(2)}`,
        claseApoderadoNombre: claseSeleccionada.label,
        nombre: nombreCompleto,
        tipoDocumento: personaNaturalStore.tipoDocumento as TipoDocumentosEnum,
        numeroDocumento: personaNaturalStore.numeroDocumento,
      };
      apoderados.value.push(nuevoApoderado);
    } else if (modeModalApoderado.value === "editar" && editingApoderadoId.value) {
      const apoderado = apoderados.value.find((a) => a.id === editingApoderadoId.value);
      if (apoderado) {
        apoderado.claseApoderadoNombre = claseSeleccionada.label;
        apoderado.nombre = nombreCompleto;
        apoderado.tipoDocumento = personaNaturalStore.tipoDocumento as TipoDocumentosEnum;
        apoderado.numeroDocumento = personaNaturalStore.numeroDocumento;
      }
    }

    handleCloseModalApoderado();
  };

  const handleEditarApoderado = (apoderadoId: string) => {
    const apoderado = apoderados.value.find((a) => a.id === apoderadoId);
    if (!apoderado) return;

    // Separar nombre completo en partes
    const partesNombre = apoderado.nombre.split(" ");
    const nombre = partesNombre[0] || "";
    const apellidoPaterno = partesNombre[1] || "";
    const apellidoMaterno = partesNombre.slice(2).join(" ") || "";

    // Cargar datos en el store
    personaNaturalStore.setFormData({
      tipoDocumento: apoderado.tipoDocumento,
      numeroDocumento: apoderado.numeroDocumento,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      paisPasaporte: "",
      estadoCivil: null,
    });

    // Buscar la clase por nombre
    const clase = claseOptions.value.find((c) => c.label === apoderado.claseApoderadoNombre);
    selectedClaseId.value = clase?.id || "";
    mostrarSelectorClase.value = true;
    editingApoderadoId.value = apoderadoId;
    modeModalApoderado.value = "editar";
    isOpenModalApoderado.value = true;
  };

  const handleEliminarApoderado = (apoderadoId: string) => {
    apoderados.value = apoderados.value.filter((a) => a.id !== apoderadoId);
  };

  const apoderadoActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditarApoderado,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleEliminarApoderado,
    },
  ];

  // ========== HANDLERS PARA OTROS APODERADOS ==========
  const openModalOtroApoderado = () => {
    // Para "Otros Apoderados", la clase está fija
    const claseOtros = claseOptions.value.find(
      (c) => c.label === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS
    );
    selectedClaseIdOtros.value = claseOtros?.id || "";
    editingOtroApoderadoId.value = null;
    modeModalOtroApoderado.value = "crear";
    personaNaturalStore.$reset();
    isOpenModalOtroApoderado.value = true;
  };

  const handleCloseModalOtroApoderado = () => {
    isOpenModalOtroApoderado.value = false;
    modeModalOtroApoderado.value = "crear";
    selectedClaseIdOtros.value = "";
    editingOtroApoderadoId.value = null;
    personaNaturalStore.$reset();
  };

  const handleSubmitOtroApoderado = () => {
    const nombreCompleto = `${personaNaturalStore.nombre} ${
      personaNaturalStore.apellidoPaterno
    } ${personaNaturalStore.apellidoMaterno || ""}`.trim();

    if (modeModalOtroApoderado.value === "crear") {
      const nuevoOtroApoderado: ApoderadoRow = {
        id: `otro-apod-${Math.random().toString(36).slice(2)}`,
        claseApoderadoNombre: ClasesApoderadoEspecialesEnum.OTROS_APODERADOS,
        nombre: nombreCompleto,
        tipoDocumento: personaNaturalStore.tipoDocumento as TipoDocumentosEnum,
        numeroDocumento: personaNaturalStore.numeroDocumento,
      };
      otrosApoderados.value.push(nuevoOtroApoderado);
    } else if (modeModalOtroApoderado.value === "editar" && editingOtroApoderadoId.value) {
      const apoderado = otrosApoderados.value.find(
        (a) => a.id === editingOtroApoderadoId.value
      );
      if (apoderado) {
        apoderado.nombre = nombreCompleto;
        apoderado.tipoDocumento = personaNaturalStore.tipoDocumento as TipoDocumentosEnum;
        apoderado.numeroDocumento = personaNaturalStore.numeroDocumento;
      }
    }

    handleCloseModalOtroApoderado();
  };

  const handleEditarOtroApoderado = (apoderadoId: string) => {
    const apoderado = otrosApoderados.value.find((a) => a.id === apoderadoId);
    if (!apoderado) return;

    // Separar nombre completo en partes
    const partesNombre = apoderado.nombre.split(" ");
    const nombre = partesNombre[0] || "";
    const apellidoPaterno = partesNombre[1] || "";
    const apellidoMaterno = partesNombre.slice(2).join(" ") || "";

    // Cargar datos en el store
    personaNaturalStore.setFormData({
      tipoDocumento: apoderado.tipoDocumento,
      numeroDocumento: apoderado.numeroDocumento,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      paisPasaporte: "",
      estadoCivil: null,
    });

    // Para "Otros Apoderados", la clase está fija
    const claseOtros = claseOptions.value.find(
      (c) => c.label === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS
    );
    selectedClaseIdOtros.value = claseOtros?.id || "";
    editingOtroApoderadoId.value = apoderadoId;
    modeModalOtroApoderado.value = "editar";
    isOpenModalOtroApoderado.value = true;
  };

  const handleEliminarOtroApoderado = (apoderadoId: string) => {
    otrosApoderados.value = otrosApoderados.value.filter((a) => a.id !== apoderadoId);
  };

  const otroApoderadoActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditarOtroApoderado,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleEliminarOtroApoderado,
    },
  ];
</script>
