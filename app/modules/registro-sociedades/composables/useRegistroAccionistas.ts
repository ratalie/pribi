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
import { TipoAccionistaEnum } from "../types/enums/TipoAccionistaEnum";
import {
  transformarAccionistaAModal,
  transformarModalAAccionista,
} from "../utils/transformAccionistasModal";

export const useRegistroAccionistas = () => {
  const registroAccionistasStore = useRegistroAccionistasStore();

  const isModalOpen = ref(false);
  const tipoAccionista = ref<TipoAccionistaEnum>(TipoAccionistaEnum.NATURAL);
  const modalMode = ref<"crear" | "editar">("crear");
  const idAccionistaEditando = ref<string | null>(null);

  const STORE_MAP: Record<TipoAccionistaEnum, () => any> = {
    [TipoAccionistaEnum.NATURAL]: () => useAccionistaNaturalStore(),
    [TipoAccionistaEnum.JURIDICA]: () => useAccionistaJuridicoStore(),
    [TipoAccionistaEnum.SUCURSAL]: () => useAccionistaSucursalStore(),
    [TipoAccionistaEnum.SUCESIONES_INDIVISAS]: () => useAccionistaSucesionesIndivisasStore(),
    [TipoAccionistaEnum.FIDEICOMISOS]: () => useAccionistaFideicomisosStore(),
    [TipoAccionistaEnum.FONDOS_INVERSION]: () => useAccionistaFondosInversionStore(),
  };

  const openModal = () => {
    modalMode.value = "crear";
    tipoAccionista.value = TipoAccionistaEnum.NATURAL;
    idAccionistaEditando.value = null;
    isModalOpen.value = true;
  };

  const cargarAccionistaParaEditar = (idAccionista: string) => {
    const accionista = registroAccionistasStore.obtenerAccionista(idAccionista);

    if (!accionista) {
      console.error(`No se encontró el accionista con id: ${idAccionista}`);
      return;
    }

    const { stateModal, stateRepresentante } = transformarAccionistaAModal(accionista);

    // Cargar datos en el store correspondiente según el tipo
    const storeModal: any = STORE_MAP[accionista.tipoAccionista as TipoAccionistaEnum]();

    storeModal.$patch(stateModal);

    if (stateRepresentante) {
      usePersonaNaturalStore().$patch(stateRepresentante);
    }

    tipoAccionista.value = accionista.tipoAccionista as TipoAccionistaEnum;
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
    tipoAccionista.value = TipoAccionistaEnum.NATURAL;
  };

  const handleSubmitAccionista = () => {
    // Obtener el state del store del tipo de accionista actual
    const storeModal = STORE_MAP[tipoAccionista.value]();

    const stateModal = storeModal.$state;
    const stateRepresentante = stateModal.tieneRepresentante
      ? usePersonaNaturalStore().$state
      : null;

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
