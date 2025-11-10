import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";

export const useApoderadosFacultades = () => {
  const _regimenFacultadesStore = useRegimenFacultadesStore();

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

  return {
    facultadActions,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    openModalFacultadApoderado,
  };
};
