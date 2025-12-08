import { useConfirmDelete } from "~/composables/useConfirmDelete";
import { useClasesYApoderadosStore } from "../stores/useClasesYApoderadoStore";
import { mapperNombreAEntidad } from "../utils/mapper-clases-apoderados";

export const useClasesApoderado = (profileId: string) => {
  const clasesYApoderadoStore = useClasesYApoderadosStore();
  const valorInicialClase = ref("");

  const isOpenModalClase = ref(false);
  const isLoadingClase = ref(false);
  const modeModalClase = ref<"crear" | "editar">("crear");
  const editingClaseId = ref<string | null>(null);

  const openModalClase = () => {
    isOpenModalClase.value = true;
  };

  const closeModalClase = () => {
    isOpenModalClase.value = false;
    modeModalClase.value = "crear";
    editingClaseId.value = null;
    valorInicialClase.value = "";
  };

  const handleSubmitClase = async (nombreClase: string) => {
    try {
      isLoadingClase.value = true;

      const entity = mapperNombreAEntidad(nombreClase, editingClaseId.value);

      if (modeModalClase.value === "crear") {
        await clasesYApoderadoStore.crearClase(profileId, entity);
      } else {
        await clasesYApoderadoStore.actualizarClase(profileId, entity);
      }

      closeModalClase();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      isLoadingClase.value = false;
    }
  };

  const handleEditarClase = (claseId: string) => {
    const clase = clasesYApoderadoStore.obtenerClasePorId(claseId);

    if (!clase) {
      console.error("Clase no encontrada");
      return;
    }

    valorInicialClase.value = clase.nombre;

    editingClaseId.value = claseId;
    modeModalClase.value = "editar";
    openModalClase();
  };

  // Estado para el modal de confirmación de eliminación
  const idClaseAEliminar = ref<string | null>(null);

  const confirmDelete = useConfirmDelete(
    async () => {
      if (!idClaseAEliminar.value) {
        throw new Error("No se encontró el ID de la clase para eliminar");
      }
      await clasesYApoderadoStore.eliminarClase(profileId, idClaseAEliminar.value);
    },
    {
      title: "Confirmar eliminación",
      message:
        "¿Estás seguro de que deseas eliminar esta clase de apoderado? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
    }
  );

  const handleEliminarClase = (claseId: string) => {
    // Guardar el ID y abrir el modal de confirmación
    idClaseAEliminar.value = claseId;
    confirmDelete.open();
  };

  const claseActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditarClase,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleEliminarClase,
    },
  ];

  return {
    clasesYApoderadoStore,
    valorInicialClase,
    claseActions,
    isOpenModalClase,
    isLoadingClase,
    modeModalClase,
    openModalClase,
    closeModalClase,
    handleSubmitClase,
    // Modal de confirmación de eliminación
    confirmDelete,
  };
};
