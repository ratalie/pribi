import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";
import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { usePersonaJuridicaStore, type PersonaJuridicaState } from "~/stores/usePersonaJuridicaStore";
import { usePersonaNaturalStore, type PersonaNaturalState } from "~/stores/usePersonaNaturalStore";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import { useRegistroApoderadoModalStore } from "../stores/modal/useRegistroApoderadoModalStore";
import { useRegistroApoderadosStore } from "../stores/useRegistroApoderadosStore";
import type { RegistroApoderado, RegistroApoderadoRow } from "../types/registroApoderados";

export const useRegistroApoderados = () => {
  const registroApoderadosStore = useRegistroApoderadosStore();
  const registroApoderadoModalStore = useRegistroApoderadoModalStore();
  const personaNaturalStore = usePersonaNaturalStore();
  const personaJuridicaStore = usePersonaJuridicaStore();

  const tipoDocumentoValues = new Set(Object.values(TipoDocumentosEnum));
  const ensureTipoDocumento = (value: string): TipoDocumentosEnum | "" => {
    return tipoDocumentoValues.has(value as TipoDocumentosEnum) ? (value as TipoDocumentosEnum) : "";
  };

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
    personaNaturalStore.$reset();
    personaJuridicaStore.$reset();
  };

  const openModalRegistroApoderado = () => {
    modeModalApoderado.value = "crear";
    apoderadoId.value = null;
    registroApoderadoModalStore.$reset();
    registroApoderadoModalStore.setTipoPersona("natural");
    registroApoderadoModalStore.esEmpresaConstituidaEnPeru = true;
    resetPersonaData();
    personaJuridicaStore.setJurisdiccion("peruana");
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
    resetPersonaData();

    if (apoderado.tipoPersona === "juridica") {
      registroApoderadoModalStore.setTipoPersona("juridica");
      registroApoderadoModalStore.esEmpresaConstituidaEnPeru =
        apoderado.personaJuridica?.jurisdiccion === "peruana";
      registroApoderadoModalStore.tieneRepresentante = Boolean(
        apoderado.personaJuridica?.representadoPor
      );

      if (apoderado.personaJuridica) {
        personaJuridicaStore.$patch({ ...apoderado.personaJuridica });
      }
    } else {
      registroApoderadoModalStore.setTipoPersona("natural");
      registroApoderadoModalStore.esEmpresaConstituidaEnPeru = false;
      registroApoderadoModalStore.tieneRepresentante = false;

      if (apoderado.personaNatural) {
        personaNaturalStore.$patch({ ...apoderado.personaNatural });
      } else {
        personaNaturalStore.tipoDocumento = ensureTipoDocumento(apoderado.tipoDocumento);
        personaNaturalStore.numeroDocumento = apoderado.numeroDocumento;
        personaNaturalStore.nombre = apoderado.nombreRazonSocial;
      }
    }

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

    const tipoPersona =
      (registroApoderadoModalStore.tipoPersona as "natural" | "juridica") || "natural";

    const payload: RegistroApoderado = {
      id: apoderadoId.value ?? uuidv4(),
      claseApoderadoId: registroApoderadoModalStore.tipoApoderado,
      tipoPersona,
      nombreRazonSocial: "",
      tipoDocumento: "",
      numeroDocumento: "",
      personaNatural: null,
      personaJuridica: null,
    };

    if (tipoPersona === "juridica") {
      const personaData: PersonaJuridicaState = {
        seConstituyoEnPeru: personaJuridicaStore.seConstituyoEnPeru,
        jurisdiccion: personaJuridicaStore.jurisdiccion,
        tipoDocumento: personaJuridicaStore.tipoDocumento,
        numeroDocumento: personaJuridicaStore.numeroDocumento,
        nombreComercial: personaJuridicaStore.nombreComercial,
        razonSocial: personaJuridicaStore.razonSocial,
        pais: personaJuridicaStore.pais,
        paisOrigen: personaJuridicaStore.paisOrigen,
        direccion: personaJuridicaStore.direccion,
        provincia: personaJuridicaStore.provincia,
        distrito: personaJuridicaStore.distrito,
        departamento: personaJuridicaStore.departamento,
        tieneRepresentante: personaJuridicaStore.tieneRepresentante,
        representadoPor: personaJuridicaStore.representadoPor
          ? { ...personaJuridicaStore.representadoPor }
          : null,
      };

      payload.nombreRazonSocial =
        personaData.razonSocial?.trim() ||
        personaData.nombreComercial?.trim() ||
        "Sin razón social";
      payload.tipoDocumento = personaData.tipoDocumento;
      payload.numeroDocumento = personaData.numeroDocumento;
      payload.personaJuridica = personaData;
      payload.personaNatural = null;
    } else {
      const personaNaturalData: PersonaNaturalState = {
        tipoDocumento: personaNaturalStore.tipoDocumento,
        numeroDocumento: personaNaturalStore.numeroDocumento,
        nombre: personaNaturalStore.nombre,
        apellidoPaterno: personaNaturalStore.apellidoPaterno,
        apellidoMaterno: personaNaturalStore.apellidoMaterno,
        paisPasaporte: personaNaturalStore.paisPasaporte,
        estadoCivil: personaNaturalStore.estadoCivil,
      };

      payload.nombreRazonSocial = buildNombreCompleto() || "Sin nombre";
      payload.tipoDocumento = personaNaturalData.tipoDocumento;
      payload.numeroDocumento = personaNaturalData.numeroDocumento;
      payload.personaNatural = personaNaturalData;
      payload.personaJuridica = null;
    }

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
