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

  const handleEliminarClase = async (claseId: string) => {
    try {
      await clasesYApoderadoStore.eliminarClase(profileId, claseId);
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
    clasesYApoderadoStore,
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
