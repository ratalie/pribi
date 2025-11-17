import { useApoderadoFacultadStore } from "../stores/modal/useApoderadoFacultadStore";
import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";
import {
  transformarFacultadAModal,
  transformarModalAFacultad,
} from "../utils/transformFacultadModal";

export const useOtrosApoderadosFacultades = () => {
  const regimenFacultadesStore = useRegimenFacultadesStore();
  const apoderadoFacultadStore = useApoderadoFacultadStore();

  const isApoderadoFacultadesModalOpen = ref(false);
  const idApoderado = ref<string | null>(null);
  const idFacultad = ref<string | null>(null);
  const modeModalApoderadoFacultad = ref<"crear" | "editar">("crear");

  const cargarFacultadParaEditar = (idApod: string, idFac: string) => {
    const apoderado = regimenFacultadesStore.otrosApoderados.find((a) => a.id === idApod);

    if (!apoderado) {
      console.error(`No se encontró el otro apoderado con id: ${idApod}`);
      return;
    }

    const facultad = apoderado.facultades.find((f) => f.id === idFac);

    if (!facultad) {
      console.error(`No se encontró la facultad con id: ${idFac}`);
      return;
    }

    const modalData = transformarFacultadAModal(facultad, regimenFacultadesStore);

    if (!modalData) {
      console.error("Error al transformar la facultad para editar");
      return;
    }

    apoderadoFacultadStore.$patch(modalData);

    idApoderado.value = idApod;
    idFacultad.value = idFac;
    modeModalApoderadoFacultad.value = "editar";
    isApoderadoFacultadesModalOpen.value = true;
  };

  const eliminarFacultad = (idFacultad: string, idApoderado: string) => {
    regimenFacultadesStore.eliminarFacultadOtroApoderado(idApoderado, idFacultad);
  };

  const facultadActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (idFac: string, idApod: string) => {
        cargarFacultadParaEditar(idApod, idFac);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (idFac: string, idApod: string) => {
        eliminarFacultad(idFac, idApod);
      },
    },
  ];

  const openModalFacultadApoderado = (id: string) => {
    idApoderado.value = id;
    modeModalApoderadoFacultad.value = "crear";
    isApoderadoFacultadesModalOpen.value = true;
  };

  const handleCloseModalApoderadoFacultad = () => {
    apoderadoFacultadStore.$reset();
    isApoderadoFacultadesModalOpen.value = false;
    idApoderado.value = null;
    idFacultad.value = null;
    modeModalApoderadoFacultad.value = "crear";
  };

  const handleSubmitApoderadoFacultad = () => {
    if (!idApoderado.value) {
      console.error("No se encontró el id del otro apoderado");
      return;
    }

    if (modeModalApoderadoFacultad.value === "editar" && idFacultad.value) {
      const facultadActualizada = transformarModalAFacultad(
        apoderadoFacultadStore,
        regimenFacultadesStore,
        idFacultad.value
      );

      if (!facultadActualizada) {
        console.error("Error al transformar los datos del modal");
        return;
      }

      regimenFacultadesStore.editarFacultadOtroApoderado(
        idApoderado.value,
        idFacultad.value,
        facultadActualizada
      );
    } else {
      const nuevaFacultad = transformarModalAFacultad(
        apoderadoFacultadStore,
        regimenFacultadesStore
      );

      if (!nuevaFacultad) {
        console.error("Error al transformar los datos del modal");
        return;
      }

      regimenFacultadesStore.agregarFacultadOtroApoderado(idApoderado.value, nuevaFacultad);
    }

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

