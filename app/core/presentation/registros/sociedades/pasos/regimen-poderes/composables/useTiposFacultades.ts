import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { useTiposFacultadStore } from "../stores/modal/useTiposFacultadStore";
import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";
import type { TipoFacultadRow } from "../types/facultades";
import { mapperTiposFacultadesAEntidad } from "../utils/mapperTiposFacultades";

export const useTiposFacultades = (profileId: string) => {
  const regimenFacultadesStore = useRegimenFacultadesStore();

  const tiposFacultadStore = useTiposFacultadStore();

  const modeModal = ref<"crear" | "editar">("crear");
  const isLoadingTipoFacultad = ref(false);
  const isTipoFacultadesModalOpen = ref(false);
  const idTipoFacultad = ref<string | null>(null);

  const tipoFacultadesColumns: TableColumn<TipoFacultadRow>[] = [
    { key: "table_id", label: "ID", type: "text" },
    { key: "tipo_facultades", label: "Tipo de Facultades", type: "text" },
    { key: "numero_apoderados", label: "Nº de apoderados", type: "text" },
  ];

  const tipoFacultadesHeaders = getColumns(tipoFacultadesColumns);

  const handleCloseModal = () => {
    tiposFacultadStore.$reset();
    isTipoFacultadesModalOpen.value = false;
    modeModal.value = "crear";
    idTipoFacultad.value = null;
  };

  const handleSubmitTipoFacultad = () => {
    try {
      isLoadingTipoFacultad.value = true;

      const entity = mapperTiposFacultadesAEntidad(
        tiposFacultadStore.nombreFacultad,
        idTipoFacultad.value ?? undefined
      );

      if (modeModal.value === "editar" && idTipoFacultad.value) {
        regimenFacultadesStore.editarTipoFacultad(profileId, entity);
      }

      if (modeModal.value === "crear") {
        regimenFacultadesStore.agregarTipoFacultad(profileId, entity);
      }

      handleCloseModal();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      isLoadingTipoFacultad.value = false;
    }
  };

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

  const handleDeleteMode = async (id: string) => {
    try {
      const tipoFacultad = regimenFacultadesStore.tipoFacultades.find(
        (facultad) => facultad.id === id
      );

      if (!tipoFacultad) {
        throw new Error("Tipo de facultad no encontrada para eliminar");
      }

      await regimenFacultadesStore.eliminarTipoFacultad(profileId, tipoFacultad.id);
    } catch (error) {
      console.error(error);
      throw error;
    }
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

  return {
    regimenFacultadesStore,
    modeModal,
    isLoadingTipoFacultad,
    tipoFacultadesHeaders,
    tipoFacultadesActions,
    isTipoFacultadesModalOpen,
    handleSubmitTipoFacultad,
    handleCloseModal,
  };
};
