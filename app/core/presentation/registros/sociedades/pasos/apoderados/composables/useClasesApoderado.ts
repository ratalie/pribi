import { useClasesApoderadoStore } from "../stores/useClasesApoderadoStore";
import { mapperNombreAEntidad } from "../utils/mapper-clases-apoderados";

export const useClasesApoderado = (profileId: string) => {
  const clasesApoderadoStore = useClasesApoderadoStore();
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
        await clasesApoderadoStore.crearClase(profileId, entity);
      } else {
        await clasesApoderadoStore.actualizarClase(profileId, entity);
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
    const clase = clasesApoderadoStore.obtenerClasePorId(claseId);

    if (!clase) {
      console.error("Clase no encontrada");
      return;
    }

    valorInicialClase.value = clase.nombre;

    editingClaseId.value = claseId;
    modeModalClase.value = "editar";
    openModalClase();
  };

  const handleEliminarClase = async (claseId: string) => {
    try {
      await clasesApoderadoStore.eliminarClase(profileId, claseId);
    } catch (error) {
      console.error(error);
      throw error;
    }
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
    clasesApoderadoStore,
    valorInicialClase,
    claseActions,
    isOpenModalClase,
    isLoadingClase,
    modeModalClase,
    openModalClase,
    closeModalClase,
    handleSubmitClase,
  };
};
