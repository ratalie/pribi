import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";
import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
import { useRegistroApoderadoModalStore } from "../stores/modal/useRegistroApoderadoModalStore";
import { useRegistroApoderadosStore } from "../stores/useRegistroApoderadosStore";
import type { RegistroApoderadoRow } from "../types/registroApoderados";

export const useRegistroApoderados = () => {
  const registroApoderadosStore = useRegistroApoderadosStore();
  const registroApoderadoModalStore = useRegistroApoderadoModalStore();
  const personaNaturalStore = usePersonaNaturalStore();

  const modeModalApoderado = ref<"crear" | "editar">("crear");
  const isRegistroModalOpen = ref(false);
  const apoderadoId = ref<string | null>(null);

  const registroColumns: TableColumn<RegistroApoderadoRow>[] = [
    { key: "clase_apoderado", label: "Clase de Apoderado", type: "text" },
    { key: "nombre_razon_social", label: "Nombre/Razón social", type: "text" },
    { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
    { key: "numero_documento", label: "No. de Documento", type: "text" },
  ];

  const registroHeaders = getColumns(registroColumns);

  const resetPersonaData = () => {
    personaNaturalStore.tipoDocumento = "";
    personaNaturalStore.numeroDocumento = "";
    personaNaturalStore.nombre = "";
    personaNaturalStore.apellidoPaterno = "";
    personaNaturalStore.apellidoMaterno = "";
    personaNaturalStore.estadoCivil = null;
  };

  const openModalRegistroApoderado = () => {
    modeModalApoderado.value = "crear";
    apoderadoId.value = null;
    registroApoderadoModalStore.$reset();
    resetPersonaData();
    isRegistroModalOpen.value = true;
  };

  const handleEditApoderado = (id: string) => {
    const apoderado = registroApoderadosStore.apoderados.find((item) => item.id === id);

    if (!apoderado) {
      console.warn("[useRegistroApoderados] Apoderado no encontrado para edición", id);
      return;
    }

    modeModalApoderado.value = "editar";
    apoderadoId.value = id;
    registroApoderadoModalStore.setTipoApoderado(apoderado.claseApoderadoId);
    registroApoderadoModalStore.setTipoPersona("natural");
    registroApoderadoModalStore.esEmpresaConstituidaEnPeru = false;
    registroApoderadoModalStore.tieneRepresentante = false;

    resetPersonaData();
    personaNaturalStore.tipoDocumento = apoderado.tipoDocumento;
    personaNaturalStore.numeroDocumento = apoderado.numeroDocumento;
    personaNaturalStore.nombre = apoderado.nombreRazonSocial;

    isRegistroModalOpen.value = true;
  };

  const handleDeleteApoderado = (id: string) => {
    registroApoderadosStore.eliminarApoderado(id);
  };

  const buildNombreCompleto = () => {
    const parts = [
      personaNaturalStore.nombre,
      personaNaturalStore.apellidoPaterno,
      personaNaturalStore.apellidoMaterno,
    ]
      .map((part) => part?.trim())
      .filter((part) => !!part);

    return parts.join(" ").trim();
  };

  const handleSubmitRegistroApoderado = () => {
    if (!registroApoderadoModalStore.tipoApoderado) {
      return;
    }

    const nombreCompleto = buildNombreCompleto() || "Sin nombre";

    const payload = {
      id: apoderadoId.value ?? uuidv4(),
      claseApoderadoId: registroApoderadoModalStore.tipoApoderado,
      nombreRazonSocial: nombreCompleto,
      tipoDocumento: personaNaturalStore.tipoDocumento,
      numeroDocumento: personaNaturalStore.numeroDocumento,
    };

    if (modeModalApoderado.value === "editar" && apoderadoId.value) {
      registroApoderadosStore.editarApoderado(payload);
    } else {
      registroApoderadosStore.agregarApoderado(payload);
    }

    handleCloseRegistroModal();
  };

  const handleCloseRegistroModal = () => {
    registroApoderadoModalStore.$reset();
    resetPersonaData();
    isRegistroModalOpen.value = false;
    modeModalApoderado.value = "crear";
    apoderadoId.value = null;
  };

  const registroActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditApoderado,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleDeleteApoderado,
    },
  ];

  const registroData = computed(() => registroApoderadosStore.tablaRegistroApoderados);

  return {
    registroData,
    registroHeaders,
    registroActions,
    isRegistroModalOpen,
    modeModalApoderado,
    openModalRegistroApoderado,
    handleSubmitRegistroApoderado,
    handleCloseRegistroModal,
  };
};
