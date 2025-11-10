import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";
import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { useClaseApoderadoModalStore } from "../stores/modal/useClaseApoderadoModalStore";
import { useRegistroApoderadosStore } from "../stores/useRegistroApoderadosStore";
import type { ClaseApoderadoRow } from "../types/registroApoderados";

export const useClasesApoderado = () => {
  const registroApoderadosStore = useRegistroApoderadosStore();
  const claseApoderadoModalStore = useClaseApoderadoModalStore();

  const modeModalClase = ref<"crear" | "editar">("crear");
  const isClaseModalOpen = ref(false);
  const claseApoderadoId = ref<string | null>(null);

  const claseColumns: TableColumn<ClaseApoderadoRow>[] = [
    { key: "id", label: "ID", type: "text" },
    { key: "clase_apoderado", label: "Clase de Apoderado", type: "text" },
    { key: "numero_apoderados", label: "No. de apoderados", type: "text" },
  ];

  const claseHeaders = getColumns(claseColumns);

  const handleCreateClase = () => {
    modeModalClase.value = "crear";
    claseApoderadoId.value = null;
    claseApoderadoModalStore.$reset();
    isClaseModalOpen.value = true;
  };

  const handleEditClase = (id: string) => {
    const clase = registroApoderadosStore.clasesApoderado.find((item) => item.id === id);

    if (!clase) {
      console.warn("[useClasesApoderado] Clase no encontrada para edición", id);
      return;
    }

    modeModalClase.value = "editar";
    claseApoderadoId.value = id;
    claseApoderadoModalStore.setNombreClase(clase.nombre);
    isClaseModalOpen.value = true;
  };

  const handleDeleteClase = (id: string) => {
    registroApoderadosStore.eliminarClaseApoderado(id);
  };

  const handleSubmitClase = () => {
    if (!claseApoderadoModalStore.nombreClase.trim()) {
      return;
    }

    if (modeModalClase.value === "editar" && claseApoderadoId.value) {
      registroApoderadosStore.editarClaseApoderado({
        id: claseApoderadoId.value,
        nombre: claseApoderadoModalStore.nombreClase,
      });
    } else {
      registroApoderadosStore.agregarClaseApoderado({
        id: uuidv4(),
        nombre: claseApoderadoModalStore.nombreClase,
      });
    }

    handleCloseClaseModal();
  };

  const handleCloseClaseModal = () => {
    claseApoderadoModalStore.$reset();
    isClaseModalOpen.value = false;
    modeModalClase.value = "crear";
    claseApoderadoId.value = null;
  };

  const claseActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditClase,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleDeleteClase,
    },
  ];

  const showActionsFor = (row: ClaseApoderadoRow) => row.numero_apoderados > 0;

  const tablaClases = computed(() => registroApoderadosStore.tablaClasesApoderado);

  return {
    tablaClases,
    claseHeaders,
    claseActions,
    showActionsFor,
    isClaseModalOpen,
    modeModalClase,
    handleCreateClase,
    handleSubmitClase,
    handleCloseClaseModal,
  };
};
