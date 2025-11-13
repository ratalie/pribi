import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";
import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import { useRegistroApoderadosStore } from "../stores/useRegistroApoderadosStore";
import type { OtroApoderado, OtroApoderadoRow } from "../types/registroApoderados";

export const useOtrosApoderados = () => {
  const tipoDocumentoValues = new Set(Object.values(TipoDocumentosEnum));

  const ensureTipoDocumento = (value: string): TipoDocumentosEnum | "" => {
    return tipoDocumentoValues.has(value as TipoDocumentosEnum) ? (value as TipoDocumentosEnum) : "";
  };
  const registroApoderadosStore = useRegistroApoderadosStore();
  const personaNaturalStore = usePersonaNaturalStore();

  const modeModalOtroApoderado = ref<"crear" | "editar">("crear");
  const isOtroApoderadoModalOpen = ref(false);
  const otroApoderadoId = ref<string | null>(null);

  const otrosColumns: TableColumn<OtroApoderadoRow>[] = [
    { key: "nombre_razon_social", label: "Nombre/Razón social", type: "text" },
    { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
    { key: "numero_documento", label: "No. de Documento", type: "text" },
  ];

  const otrosHeaders = getColumns(otrosColumns);

  const resetPersonaData = () => {
    personaNaturalStore.$reset();
  };

  const openModalRegistroOtroApoderado = () => {
    modeModalOtroApoderado.value = "crear";
    otroApoderadoId.value = null;
    resetPersonaData();
    isOtroApoderadoModalOpen.value = true;
  };

  const handleEditOtroApoderado = (id: string) => {
    const apoderado = registroApoderadosStore.otrosApoderados.find((item) => item.id === id);

    if (!apoderado) {
      console.warn("[useOtrosApoderados] Apoderado no encontrado para edición", id);
      return;
    }

    modeModalOtroApoderado.value = "editar";
    otroApoderadoId.value = id;
    resetPersonaData();
    if (apoderado.personaNatural) {
      personaNaturalStore.$patch({ ...apoderado.personaNatural });
    } else {
      personaNaturalStore.tipoDocumento = ensureTipoDocumento(apoderado.tipoDocumento);
      personaNaturalStore.numeroDocumento = apoderado.numeroDocumento;
      personaNaturalStore.nombre = apoderado.nombreRazonSocial;
    }

    isOtroApoderadoModalOpen.value = true;
  };

  const handleDeleteOtroApoderado = (id: string) => {
    registroApoderadosStore.eliminarOtroApoderado(id);
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

  const handleSubmitRegistroOtroApoderado = () => {
    const nombreCompleto = buildNombreCompleto() || "Sin nombre";

    const payload: OtroApoderado = {
      id: otroApoderadoId.value ?? uuidv4(),
      nombreRazonSocial: nombreCompleto,
      tipoDocumento: personaNaturalStore.tipoDocumento,
      numeroDocumento: personaNaturalStore.numeroDocumento,
      personaNatural: {
        tipoDocumento: personaNaturalStore.tipoDocumento,
        numeroDocumento: personaNaturalStore.numeroDocumento,
        nombre: personaNaturalStore.nombre,
        apellidoPaterno: personaNaturalStore.apellidoPaterno,
        apellidoMaterno: personaNaturalStore.apellidoMaterno,
        paisPasaporte: personaNaturalStore.paisPasaporte,
        estadoCivil: personaNaturalStore.estadoCivil,
      },
    };

    if (modeModalOtroApoderado.value === "editar" && otroApoderadoId.value) {
      registroApoderadosStore.editarOtroApoderado(payload);
    } else {
      registroApoderadosStore.agregarOtroApoderado(payload);
    }

    handleCloseOtroApoderadoModal();
  };

  const handleCloseOtroApoderadoModal = () => {
    resetPersonaData();
    isOtroApoderadoModalOpen.value = false;
    modeModalOtroApoderado.value = "crear";
    otroApoderadoId.value = null;
  };

  const otrosApoderadosActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditOtroApoderado,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleDeleteOtroApoderado,
    },
  ];

  const otrosApoderadosData = computed(() => registroApoderadosStore.tablaOtrosApoderados);

  return {
    otrosApoderadosData,
    otrosHeaders,
    otrosApoderadosActions,
    isOtroApoderadoModalOpen,
    modeModalOtroApoderado,
    openModalRegistroOtroApoderado,
    handleSubmitRegistroOtroApoderado,
    handleCloseOtroApoderadoModal,
  };
};
