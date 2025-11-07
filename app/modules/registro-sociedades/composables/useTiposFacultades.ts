import { v4 as uuidv4 } from "uuid";
import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { useTiposFacultadStore } from "../stores/modal/useTiposFacultadStore";
import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";
import type { TipoFacultadRow } from "../types/facultades";

export const useTiposFacultades = () => {
  const regimenFacultadesStore = useRegimenFacultadesStore();

  const tiposFacultadStore = useTiposFacultadStore();

  const modeModal = ref<"crear" | "editar">("crear");
  const isTipoFacultadesModalOpen = ref(false);
  const idTipoFacultad = ref<string | null>(null);

  const tipoFacultadesColumns: TableColumn<TipoFacultadRow>[] = [
    { key: "table_id", label: "ID", type: "text" },
    { key: "tipo_facultades", label: "Tipo de Facultades", type: "text" },
    { key: "numero_apoderados", label: "Nº de apoderados", type: "text" },
  ];

  const tipoFacultadesHeaders = getColumns(tipoFacultadesColumns);

  const handleEditMode = (id: string) => {
    const tipoFacultad = regimenFacultadesStore.tipoFacultades.find(
      (facultad) => facultad.id === id
    );

    if (!tipoFacultad) {
      throw new Error("Tipo de facultad no encontrada para editar");
    }

    tiposFacultadStore.setNombreFacultad(tipoFacultad.tipoFacultades);
    idTipoFacultad.value = tipoFacultad.id;

    modeModal.value = "editar";
    isTipoFacultadesModalOpen.value = true;
  };

  const handleDeleteMode = (id: string) => {
    const tipoFacultad = regimenFacultadesStore.tipoFacultades.find(
      (facultad) => facultad.id === id
    );

    if (!tipoFacultad) {
      throw new Error("Tipo de facultad no encontrada para eliminar");
    }

    regimenFacultadesStore.eliminarTipoFacultad(tipoFacultad.id);
  };

  const tipoFacultadesActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditMode,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleDeleteMode,
    },
  ];

  const handleSubmitTipoFacultad = () => {
    //se agrega la logica y el mapper para guardar en el backend

    if (modeModal.value === "editar" && idTipoFacultad.value) {
      regimenFacultadesStore.editarTipoFacultad({
        id: idTipoFacultad.value,
        tipoFacultades: tiposFacultadStore.nombreFacultad,
      });
    }

    if (modeModal.value === "crear") {
      regimenFacultadesStore.agregarTipoFacultad({
        id: uuidv4(),
        tipoFacultades: tiposFacultadStore.nombreFacultad,
      });
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    tiposFacultadStore.$reset();
    isTipoFacultadesModalOpen.value = false;
    modeModal.value = "crear";
    idTipoFacultad.value = null;
  };

  return {
    regimenFacultadesStore,
    modeModal,
    tipoFacultadesHeaders,
    tipoFacultadesActions,
    isTipoFacultadesModalOpen,
    handleSubmitTipoFacultad,
    handleCloseModal,
  };
};
