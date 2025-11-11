import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { useRegistroAccionistasStore } from "../stores/useRegistroAccionistasStore";
import type { AccionistaRow } from "../types/accionistas";

export const useRegistroAccionistas = () => {
  const registroAccionistasStore = useRegistroAccionistasStore();

  const isModalOpen = ref(false);
  const tipoAccionista = ref("");
  const modalMode = ref<"crear" | "editar">("crear");

  const societyHeaders: TableColumn<AccionistaRow>[] = [
    { key: "nombre", label: "Nombres y Apellidos/ Razón Social", type: "text" },
    { key: "tipoAccionista", label: "Tipo de Accionista", type: "text" },
    { key: "tipoDocumento", label: "Tipo de Documento", type: "text" },
    { key: "numeroDocumento", label: "N° de Documento", type: "text" },
  ];

  const columns = getColumns(societyHeaders);

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

  const openModal = () => {
    isModalOpen.value = true;
  };

  return {
    registroAccionistasStore,
    columns,
    actions,
    isModalOpen,
    tipoAccionista,
    modalMode,
    openModal,
  };
};
