import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { useConfirmDelete } from "~/composables/useConfirmDelete";
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

  // Estado para el modal de confirmación de eliminación
  const idTipoFacultadAEliminar = ref<string | null>(null);

  const confirmDelete = useConfirmDelete(
    async () => {
      if (!idTipoFacultadAEliminar.value) {
        throw new Error("No se encontró el ID del tipo de facultad para eliminar");
      }
      await regimenFacultadesStore.eliminarTipoFacultad(
        profileId,
        idTipoFacultadAEliminar.value
      );
    },
    {
      title: "Confirmar eliminación",
      message:
        "¿Estás seguro de que deseas eliminar este tipo de poder? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
    }
  );

  const handleDeleteMode = (id: string) => {
    // Guardar el ID y abrir el modal de confirmación
    idTipoFacultadAEliminar.value = id;
    confirmDelete.open();
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
    // Modal de confirmación de eliminación
    confirmDelete,
  };
};
