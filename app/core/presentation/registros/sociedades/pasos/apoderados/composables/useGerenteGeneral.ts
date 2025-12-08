import { useConfirmDelete } from "~/composables/useConfirmDelete";
import { PersonTypeEnum } from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";
import { useClasesYApoderadosStore } from "../stores/useClasesYApoderadoStore";
import {
  mapperApoderadoJuridicaEntityAModal,
  mapperApoderadoJuridicaModalALista,
  mapperApoderadoNaturalEntityAModal,
  mapperApoderadoNaturalModalALista,
} from "../utils/mapper-apoderados";

export const useGerenteGeneral = (societyId: string) => {
  const clasesYApoderadoStore = useClasesYApoderadosStore();
  const personaNaturalStore = usePersonaNaturalStore();
  const personaJuridicaStore = usePersonaJuridicaStore();

  const isOpenModalGerenteGeneral = ref(false);
  const isLoadingGerenteGeneral = ref(false);
  const modeModalGerenteGeneral = ref<"crear" | "editar">("crear");
  const tipoPersona = ref<"natural" | "juridica">("natural");
  const editingGerenteGeneralId = ref<string | null>(null);
  const editingPersonaId = ref<string | null>(null);

  const openModalGerenteGeneral = () => {
    isOpenModalGerenteGeneral.value = true;
  };

  const closeModalGerenteGeneral = () => {
    isOpenModalGerenteGeneral.value = false;
    modeModalGerenteGeneral.value = "crear";
    tipoPersona.value = "natural";
    editingGerenteGeneralId.value = null;
    editingPersonaId.value = null;

    personaNaturalStore.$reset();
    personaJuridicaStore.$reset();
  };

  const handleSubmitGerenteGeneral = async () => {
    try {
      isLoadingGerenteGeneral.value = true;

      const claseApoderadoId = clasesYApoderadoStore.obtenerGerenteGeneral()?.id ?? "";

      if (tipoPersona.value === "natural") {
        const payload = mapperApoderadoNaturalModalALista(
          claseApoderadoId,
          personaNaturalStore,
          editingGerenteGeneralId.value ?? undefined,
          editingPersonaId.value ?? undefined
        );

        if (modeModalGerenteGeneral.value === "crear") {
          await clasesYApoderadoStore.crearGerenteGeneral(societyId, payload);
        } else {
          await clasesYApoderadoStore.actualizarGerenteGeneral(societyId, payload);
        }
      }

      if (tipoPersona.value === "juridica") {
        const payload = mapperApoderadoJuridicaModalALista(
          claseApoderadoId,
          personaJuridicaStore,
          editingGerenteGeneralId.value ?? undefined,
          editingPersonaId.value ?? undefined
        );

        if (modeModalGerenteGeneral.value === "crear") {
          await clasesYApoderadoStore.crearGerenteGeneral(societyId, payload);
        } else {
          await clasesYApoderadoStore.actualizarGerenteGeneral(societyId, payload);
        }
      }

      closeModalGerenteGeneral();
    } catch (error) {
      console.error(error);
    } finally {
      isLoadingGerenteGeneral.value = false;
    }
  };

  const handleEditarGerenteGeneral = (gerenteGeneralId: string) => {
    const apoderado = clasesYApoderadoStore.obtenerApoderadoPorId(gerenteGeneralId);

    if (!apoderado) {
      throw new Error("Gerente general no encontrado");
    }

    tipoPersona.value =
      apoderado.persona.tipo === PersonTypeEnum.NATURAL ? "natural" : "juridica";

    if (tipoPersona.value === "natural") {
      personaNaturalStore.setFormData(mapperApoderadoNaturalEntityAModal(apoderado));
    } else {
      personaJuridicaStore.setFormData(mapperApoderadoJuridicaEntityAModal(apoderado));
    }

    editingGerenteGeneralId.value = apoderado.id;
    editingPersonaId.value = apoderado.persona.id;
    modeModalGerenteGeneral.value = "editar";
    openModalGerenteGeneral();
  };

  // Estado para el modal de confirmación de eliminación
  const idGerenteGeneralAEliminar = ref<string | null>(null);

  const confirmDelete = useConfirmDelete(
    async () => {
      if (!idGerenteGeneralAEliminar.value) {
        throw new Error("No se encontró el ID del gerente general para eliminar");
      }
      await clasesYApoderadoStore.eliminarApoderado(
        societyId,
        idGerenteGeneralAEliminar.value
      );
    },
    {
      title: "Confirmar eliminación",
      message:
        "¿Estás seguro de que deseas eliminar el gerente general? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
    }
  );

  const handleEliminarGerenteGeneral = (gerenteGeneralId: string) => {
    // Guardar el ID y abrir el modal de confirmación
    idGerenteGeneralAEliminar.value = gerenteGeneralId;
    confirmDelete.open();
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
    // Modal de confirmación de eliminación
    confirmDelete,
  };
};
