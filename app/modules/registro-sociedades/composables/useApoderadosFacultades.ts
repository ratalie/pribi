import { useApoderadoFacultadStore } from "../stores/modal/useApoderadoFacultadStore";
import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";

export const useApoderadosFacultades = () => {
  const _regimenFacultadesStore = useRegimenFacultadesStore();
  const apoderadoFacultadStore = useApoderadoFacultadStore();

  const isApoderadoFacultadesModalOpen = ref(false);
  const idApoderado = ref<string | null>(null);
  const modeModalApoderadoFacultad = ref<"crear" | "editar">("crear");

  const facultadActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (id: string) => {
        console.log("Editar poder", id);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (id: string) => {
        console.log("Eliminar poder", id);
      },
    },
  ];

  const openModalFacultadApoderado = (id: string) => {
    idApoderado.value = id;
    isApoderadoFacultadesModalOpen.value = true;
  };

  const handleCloseModalApoderadoFacultad = () => {
    apoderadoFacultadStore.$reset();
    isApoderadoFacultadesModalOpen.value = false;
    idApoderado.value = null;
    modeModalApoderadoFacultad.value = "crear";
  };

  const handleSubmitApoderadoFacultad = () => {
    console.log("Submit apoderado facultad");

    handleCloseModalApoderadoFacultad();
  };

  return {
    facultadActions,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
  };
};
