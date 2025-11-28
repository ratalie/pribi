import { useClasesYApoderadosStore } from "../stores/useClasesYApoderadoStore";
import {
  mapperApoderadoNaturalEntityAModal,
  mapperApoderadoNaturalModalALista,
} from "../utils/mapper-apoderados";

export const useApoderados = (societyId: string) => {
  const clasesYApoderadoStore = useClasesYApoderadosStore();
  const personaNaturalStore = usePersonaNaturalStore();
  const selectedClaseId = ref("");

  const isOpenModalApoderado = ref(false);
  const isLoadingApoderado = ref(false);
  const modeModalApoderado = ref<"crear" | "editar">("crear");
  const editingApoderadoId = ref<string | null>(null);

  const openModalApoderado = () => {
    isOpenModalApoderado.value = true;
  };

  const closeModalApoderado = () => {
    //estado del modal:
    isOpenModalApoderado.value = false;
    modeModalApoderado.value = "crear";
    editingApoderadoId.value = null;
    //valores del modal:
    selectedClaseId.value = "";
    personaNaturalStore.$reset();
  };

  const handleSubmitApoderado = async () => {
    try {
      isLoadingApoderado.value = true;

      const apoderadoEntidad = mapperApoderadoNaturalModalALista(
        selectedClaseId.value,
        personaNaturalStore,
        editingApoderadoId.value ?? undefined
      );

      if (modeModalApoderado.value === "crear") {
        await clasesYApoderadoStore.crearApoderado(societyId, apoderadoEntidad);
      } else {
        await clasesYApoderadoStore.actualizarApoderado(societyId, apoderadoEntidad);
      }

      closeModalApoderado();
    } catch (error) {
      console.error("Error al crear el apoderado", error);
    } finally {
      isLoadingApoderado.value = false;
    }
  };

  const handleEditarApoderado = (apoderadoId: string) => {
    const apoderado = clasesYApoderadoStore.obtenerApoderadoPorId(apoderadoId);

    if (apoderado) {
      personaNaturalStore.setFormData(mapperApoderadoNaturalEntityAModal(apoderado));

      selectedClaseId.value = apoderado.claseApoderadoId;

      editingApoderadoId.value = apoderadoId;
      modeModalApoderado.value = "editar";
      openModalApoderado();
    }
  };

  const handleEliminarApoderado = async (apoderadoId: string) => {
    try {
      await clasesYApoderadoStore.eliminarApoderado(societyId, apoderadoId);
    } catch (error) {
      console.error("Error al eliminar el apoderado", error);
    }
  };

  const apoderadoActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditarApoderado,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleEliminarApoderado,
    },
  ];

  return {
    selectedClaseId,
    isOpenModalApoderado,
    isLoadingApoderado,
    modeModalApoderado,
    apoderadoActions,
    openModalApoderado,
    closeModalApoderado,
    handleSubmitApoderado,
  };
};
