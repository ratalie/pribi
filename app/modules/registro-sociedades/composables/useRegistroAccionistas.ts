import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
import { useAccionistaFideicomisosStore } from "../stores/modal/accionistas/useAccionistaFideicomisosStore";
import { useAccionistaFondosInversionStore } from "../stores/modal/accionistas/useAccionistaFondosInversionStore";
import { useAccionistaJuridicoStore } from "../stores/modal/accionistas/useAccionistaJuridicoStore";
import { useAccionistaNaturalStore } from "../stores/modal/accionistas/useAccionistaNaturalStore";
import { useAccionistaSucesionesIndivisasStore } from "../stores/modal/accionistas/useAccionistaSucesionesIndivisasStore";
import { useAccionistaSucursalStore } from "../stores/modal/accionistas/useAccionistaSucursalStore";
import { useRegistroAccionistasStore } from "../stores/useRegistroAccionistasStore";
import type { AccionistaRow } from "../types/accionistas";
import {
  transformarAccionistaAModal,
  transformarModalAAccionista,
} from "../utils/transformAccionistasModal";

export const useRegistroAccionistas = () => {
  const registroAccionistasStore = useRegistroAccionistasStore();

  const isModalOpen = ref(false);
  const tipoAccionista = ref("natural");
  const modalMode = ref<"crear" | "editar">("crear");
  const idAccionistaEditando = ref<string | null>(null);

  const openModal = () => {
    modalMode.value = "crear";
    tipoAccionista.value = "natural";
    idAccionistaEditando.value = null;
    isModalOpen.value = true;
  };

  const cargarAccionistaParaEditar = (idAccionista: string) => {
    const accionista = registroAccionistasStore.obtenerAccionista(idAccionista);

    if (!accionista) {
      console.error(`No se encontró el accionista con id: ${idAccionista}`);
      return;
    }

    // Transformar accionista a formato modal (obtiene los states para hacer patch)
    const { stateModal, stateRepresentante } = transformarAccionistaAModal(accionista);

    // Cargar datos en el store correspondiente según el tipo
    switch (accionista.tipoAccionista) {
      case "natural":
        useAccionistaNaturalStore().$patch(stateModal);
        break;

      case "juridica":
        useAccionistaJuridicoStore().$patch(stateModal);
        if (stateRepresentante) {
          usePersonaNaturalStore().$patch(stateRepresentante);
        }
        break;

      case "sucursal":
        useAccionistaSucursalStore().$patch(stateModal);
        if (stateRepresentante) {
          usePersonaNaturalStore().$patch(stateRepresentante);
        }
        break;

      case "sucesiones_indivisas":
        useAccionistaSucesionesIndivisasStore().$patch(stateModal);
        if (stateRepresentante) {
          usePersonaNaturalStore().$patch(stateRepresentante);
        }
        break;

      case "fideicomisos":
        useAccionistaFideicomisosStore().$patch(stateModal);
        if (stateRepresentante) {
          usePersonaNaturalStore().$patch(stateRepresentante);
        }
        break;

      case "fondos_inversion":
        useAccionistaFondosInversionStore().$patch(stateModal);
        if (stateRepresentante) {
          usePersonaNaturalStore().$patch(stateRepresentante);
        }
        break;
    }

    // Configurar el modal para edición
    tipoAccionista.value = accionista.tipoAccionista;
    idAccionistaEditando.value = idAccionista;
    modalMode.value = "editar";
    isModalOpen.value = true;
  };

  const eliminarAccionista = (idAccionista: string) => {
    registroAccionistasStore.eliminarAccionista(idAccionista);
  };

  const handleCloseModal = () => {
    limpiarTodosLosStoresDeModal();

    // Resetear estados del composable
    isModalOpen.value = false;
    idAccionistaEditando.value = null;
    modalMode.value = "crear";
    tipoAccionista.value = "natural";
  };

  const handleSubmitAccionista = () => {
    // Obtener el state del store del tipo de accionista actual
    let stateModal: any;
    let stateRepresentante: any | null = null;

    switch (tipoAccionista.value) {
      case "natural":
        stateModal = useAccionistaNaturalStore().$state;
        break;

      case "juridica":
        stateModal = useAccionistaJuridicoStore().$state;
        if (stateModal.tieneRepresentante) {
          stateRepresentante = usePersonaNaturalStore().$state;
        }
        break;

      case "sucursal":
        stateModal = useAccionistaSucursalStore().$state;
        if (stateModal.tieneRepresentante) {
          stateRepresentante = usePersonaNaturalStore().$state;
        }
        break;

      case "sucesiones_indivisas":
        stateModal = useAccionistaSucesionesIndivisasStore().$state;
        if (stateModal.tieneRepresentante) {
          stateRepresentante = usePersonaNaturalStore().$state;
        }
        break;

      case "fideicomisos":
        stateModal = useAccionistaFideicomisosStore().$state;
        if (stateModal.tieneRepresentante) {
          stateRepresentante = usePersonaNaturalStore().$state;
        }
        break;

      case "fondos_inversion":
        stateModal = useAccionistaFondosInversionStore().$state;
        if (stateModal.tieneRepresentante) {
          stateRepresentante = usePersonaNaturalStore().$state;
        }
        break;
    }

    // Transformar datos del modal al formato Accionista
    const accionista = transformarModalAAccionista(
      tipoAccionista.value,
      stateModal,
      stateRepresentante,
      idAccionistaEditando.value || undefined
    );

    if (!accionista) {
      console.error("Error al transformar los datos del accionista");
      return;
    }

    // Guardar o actualizar según el modo
    if (modalMode.value === "editar" && idAccionistaEditando.value) {
      registroAccionistasStore.editarAccionista(idAccionistaEditando.value, accionista);
    } else {
      registroAccionistasStore.agregarAccionista(accionista);
    }

    // Limpiar stores y cerrar modal después de submit exitoso
    limpiarTodosLosStoresDeModal();
    isModalOpen.value = false;
    idAccionistaEditando.value = null;
    modalMode.value = "crear";
  };

  const limpiarTodosLosStoresDeModal = () => {
    useAccionistaNaturalStore().$reset();
    useAccionistaJuridicoStore().$reset();
    useAccionistaSucursalStore().$reset();
    useAccionistaSucesionesIndivisasStore().$reset();
    useAccionistaFideicomisosStore().$reset();
    useAccionistaFondosInversionStore().$reset();
    usePersonaNaturalStore().$reset();
  };

  const actions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (itemId: string) => {
        cargarAccionistaParaEditar(itemId);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (itemId: string) => {
        eliminarAccionista(itemId);
      },
    },
  ];

  const societyHeaders: TableColumn<AccionistaRow>[] = [
    { key: "nombre", label: "Nombres y Apellidos/ Razón Social", type: "text" },
    { key: "tipoAccionista", label: "Tipo de Accionista", type: "text" },
    { key: "tipoDocumento", label: "Tipo de Documento", type: "text" },
    { key: "numeroDocumento", label: "N° de Documento", type: "text" },
  ];

  const columns = getColumns(societyHeaders);

  return {
    registroAccionistasStore,
    columns,
    actions,
    isModalOpen,
    tipoAccionista,
    modalMode,
    openModal,
    handleCloseModal,
    handleSubmitAccionista,
  };
};
