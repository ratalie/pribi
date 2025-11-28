import { useClasesYApoderadosStore } from "../stores/useClasesYApoderadoStore";

export const useGerenteGeneral = (_profileId: string) => {
  const _clasesYApoderadoStore = useClasesYApoderadosStore();

  const isOpenModalGerenteGeneral = ref(false);
  const isLoadingGerenteGeneral = ref(false);
  const modeModalGerenteGeneral = ref<"crear" | "editar">("crear");
  const tipoPersona = ref<"natural" | "juridica">("natural");
  const editingGerenteGeneralId = ref<string | null>(null);

  const openModalGerenteGeneral = () => {
    isOpenModalGerenteGeneral.value = true;
  };

  const closeModalGerenteGeneral = () => {
    isOpenModalGerenteGeneral.value = false;
    modeModalGerenteGeneral.value = "crear";
    tipoPersona.value = "natural";
    editingGerenteGeneralId.value = null;
  };

  const handleSubmitGerenteGeneral = async () => {
    try {
      isLoadingGerenteGeneral.value = true;
    } catch (error) {
      console.error(error);
    } finally {
      isLoadingGerenteGeneral.value = false;
    }
  };

  const handleEditarGerenteGeneral = (claseId: string) => {
    console.log("Editar gerente general", claseId);
  };

  const handleEliminarGerenteGeneral = (claseId: string) => {
    console.log("Eliminar gerente general", claseId);
  };

  const gerenteActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditarGerenteGeneral,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleEliminarGerenteGeneral,
    },
  ];

  return {
    isOpenModalGerenteGeneral,
    isLoadingGerenteGeneral,
    modeModalGerenteGeneral,
    tipoPersona,
    gerenteActions,
    openModalGerenteGeneral,
    closeModalGerenteGeneral,
    handleSubmitGerenteGeneral,
  };
};
