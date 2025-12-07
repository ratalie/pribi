import { useApoderadoFacultadStore } from "../stores/modal/useApoderadoFacultadStore";
import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";
import {
  transformarFacultadAModal,
  transformarModalAFacultad,
} from "../utils/transformFacultadModal";

export const useOtrosApoderadosFacultades = (profileId: string) => {
  const regimenFacultadesStore = useRegimenFacultadesStore();
  const apoderadoFacultadStore = useApoderadoFacultadStore();

  const isApoderadoFacultadesModalOpen = ref(false);
  const idApoderado = ref<string | null>(null);
  const idFacultad = ref<string | null>(null);
  const modeModalApoderadoFacultad = ref<"crear" | "editar">("crear");
  const isLoading = ref(false);

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

    // Guardar estado original antes de editar
    regimenFacultadesStore.guardarEstadoOriginal("otro", idApod);

    // Para "Otros Apoderados", no hay clase seleccionada y debe mostrar todas las clases
    apoderadoFacultadStore.claseApoderadoIdSeleccionada = null;
    apoderadoFacultadStore.esOtrosApoderados = true;

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
    const apoderado = regimenFacultadesStore.otrosApoderados.find((a) => a.id === id);

    if (!apoderado) {
      console.warn(`No se encontró el otro apoderado con id: ${id}`);
      return;
    }

    // Verificar si hay facultades disponibles antes de abrir el modal
    const facultadesDisponibles = regimenFacultadesStore.obtenerFacultadesDisponibles(
      id,
      "otro"
    );

    if (facultadesDisponibles.length === 0) {
      console.warn(
        `No hay facultades disponibles para asignar al apoderado. El apoderado ya tiene todas las facultades asignadas.`
      );
      return;
    }

    // Para "Otros Apoderados", no hay clase seleccionada y debe mostrar todas las clases
    apoderadoFacultadStore.claseApoderadoIdSeleccionada = null;
    apoderadoFacultadStore.esOtrosApoderados = true;

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
      console.error("No se encontró el id del otro apoderado");
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
          "otro",
          idApoderado.value,
          idFacultad.value,
          entity
        );
      } else {
        // Crear nuevo otorgamiento
        // Para "Otros Apoderados", el apoderadoId individual se usa como claseApoderadoId
        await regimenFacultadesStore.createOtorgamientoPoder(
          profileId,
          "otro",
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

  // Computed para obtener las facultades disponibles (filtradas)
  const listaFacultadesDisponibles = computed(() => {
    return regimenFacultadesStore.obtenerFacultadesDisponibles(
      idApoderado.value,
      "otro",
      modeModalApoderadoFacultad.value === "editar" ? idFacultad.value ?? undefined : undefined
    );
  });

  return {
    facultadActions,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
    isLoading,
    listaFacultadesDisponibles,
  };
};
