import { useConfirmDelete } from "~/composables/useConfirmDelete";
import { useClasesYApoderadosStore } from "../stores/useClasesYApoderadoStore";
import { ClasesApoderadoEspecialesEnum } from "../types/enums/ClasesApoderadoEspecialesEnum";
import {
  mapperApoderadoNaturalEntityAModal,
  mapperApoderadoNaturalModalALista,
} from "../utils/mapper-apoderados";

export const useApoderados = (societyId: string) => {
  const clasesYApoderadoStore = useClasesYApoderadosStore();
  const personaNaturalStore = usePersonaNaturalStore();

  const selectedClaseId = ref("");
  const mostrarSelectorClase = ref(true);

  const isOpenModalApoderado = ref(false);
  const isLoadingApoderado = ref(false);
  const modeModalApoderado = ref<"crear" | "editar">("crear");
  const editingApoderadoId = ref<string | null>(null);
  const editingPersonaId = ref<string | null>(null);

  const openModalApoderado = (claseFijaNombre?: string) => {
    if (claseFijaNombre && typeof claseFijaNombre === "string") {
      selectedClaseId.value =
        clasesYApoderadoStore.clases.find((clase) => clase.nombre === claseFijaNombre)?.id ??
        "";
      mostrarSelectorClase.value = false;
    }

    isOpenModalApoderado.value = true;
  };

  const closeModalApoderado = () => {
    //estado del modal:
    isOpenModalApoderado.value = false;
    modeModalApoderado.value = "crear";
    //estados para los tipos de apoderados
    editingApoderadoId.value = null;
    editingPersonaId.value = null;
    mostrarSelectorClase.value = true;
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
        editingApoderadoId.value ?? undefined,
        editingPersonaId.value ?? undefined
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

      mostrarSelectorClase.value =
        clasesYApoderadoStore.obtenerClasePorId(apoderado.claseApoderadoId)?.nombre !==
        ClasesApoderadoEspecialesEnum.OTROS_APODERADOS;

      editingApoderadoId.value = apoderadoId;
      editingPersonaId.value = apoderado.persona.id;
      modeModalApoderado.value = "editar";
      openModalApoderado();
    }
  };

  // Estado para el modal de confirmación de eliminación
  const idApoderadoAEliminar = ref<string | null>(null);

  const confirmDelete = useConfirmDelete(
    async () => {
      if (!idApoderadoAEliminar.value) {
        throw new Error("No se encontró el ID del apoderado para eliminar");
      }
      await clasesYApoderadoStore.eliminarApoderado(societyId, idApoderadoAEliminar.value);
    },
    {
      title: "Confirmar eliminación",
      message:
        "¿Estás seguro de que deseas eliminar este apoderado? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
    }
  );

  const handleEliminarApoderado = (apoderadoId: string) => {
    // Guardar el ID y abrir el modal de confirmación
    idApoderadoAEliminar.value = apoderadoId;
    confirmDelete.open();
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
    mostrarSelectorClase,
    isOpenModalApoderado,
    isLoadingApoderado,
    modeModalApoderado,
    apoderadoActions,
    openModalApoderado,
    closeModalApoderado,
    handleSubmitApoderado,
    // Modal de confirmación de eliminación
    confirmDelete,
  };
};
