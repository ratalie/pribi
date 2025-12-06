import { useApoderadoFacultadStore } from "../stores/modal/useApoderadoFacultadStore";
import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";
import {
  transformarFacultadAModal,
  transformarModalAFacultad,
} from "../utils/transformFacultadModal";

export const useApoderadosFacultades = (profileId: string) => {
  const regimenFacultadesStore = useRegimenFacultadesStore();
  const apoderadoFacultadStore = useApoderadoFacultadStore();

  const isApoderadoFacultadesModalOpen = ref(false);
  const idApoderado = ref<string | null>(null);
  const idFacultad = ref<string | null>(null);
  const modeModalApoderadoFacultad = ref<"crear" | "editar">("crear");
  const isLoading = ref(false);

  const cargarFacultadParaEditar = (idApod: string, idFac: string) => {
    const apoderado = regimenFacultadesStore.apoderadosFacultades.find((a) => a.id === idApod);

    if (!apoderado) {
      console.error(`No se encontró el apoderado con id: ${idApod}`);
      return;
    }

    const facultad = apoderado.facultades.find((f) => f.id === idFac);

    if (!facultad) {
      console.error(`No se encontró la facultad con id: ${idFac}`);
      return;
    }

    // Guardar estado original antes de editar
    regimenFacultadesStore.guardarEstadoOriginal("clase", idApod);

    // Configurar información de la clase seleccionada
    apoderadoFacultadStore.claseApoderadoIdSeleccionada = apoderado.claseApoderadoId;
    apoderadoFacultadStore.esOtrosApoderados = false;

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
    regimenFacultadesStore.eliminarFacultadApoderado(idApoderado, idFacultad);
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
    const apoderado = regimenFacultadesStore.apoderadosFacultades.find((a) => a.id === id);

    if (apoderado) {
      apoderadoFacultadStore.claseApoderadoIdSeleccionada = apoderado.claseApoderadoId;
      apoderadoFacultadStore.esOtrosApoderados = false;
    }

    idApoderado.value = id;
    modeModalApoderadoFacultad.value = "crear";
    isApoderadoFacultadesModalOpen.value = true;
  };

  const handleCloseModalApoderadoFacultad = () => {
    // Limpiar estado original si se cancela la edición
    regimenFacultadesStore.limpiarEstadoOriginal();
    apoderadoFacultadStore.$reset();
    // Limpiar estados adicionales
    apoderadoFacultadStore.claseApoderadoIdSeleccionada = null;
    apoderadoFacultadStore.claseFirmanteSeleccionada = null;
    apoderadoFacultadStore.esOtrosApoderados = false;
    isApoderadoFacultadesModalOpen.value = false;
    idApoderado.value = null;
    idFacultad.value = null;
    modeModalApoderadoFacultad.value = "crear";
  };

  const handleSubmitApoderadoFacultad = async () => {
    if (!idApoderado.value) {
      console.error("No se encontró el id del apoderado");
      return;
    }

    isLoading.value = true;

    try {
      const entity = transformarModalAFacultad(
        apoderadoFacultadStore,
        regimenFacultadesStore,
        idFacultad.value ?? undefined
      );

      if (!entity) {
        throw new Error("Error al transformar los datos del modal");
      }

      if (modeModalApoderadoFacultad.value === "editar" && idFacultad.value) {
        // Actualizar otorgamiento existente
        // Pasar la entity transformada para que la detección de cambios use los datos del modal
        await regimenFacultadesStore.updateOtorgamientoPoder(
          profileId,
          "clase",
          idApoderado.value,
          idFacultad.value,
          entity
        );
      } else {
        // Crear nuevo otorgamiento
        await regimenFacultadesStore.createOtorgamientoPoder(
          profileId,
          "clase",
          idApoderado.value,
          entity,
          entity.tipoFacultadId
        );
      }

      handleCloseModalApoderadoFacultad();
    } catch (err) {
      console.error("Error al guardar otorgamiento de poder:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    facultadActions,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
    isLoading,
  };
};
