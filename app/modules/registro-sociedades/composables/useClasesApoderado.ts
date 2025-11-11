import type { CellContext, ColumnDef } from "@tanstack/vue-table";
import { v4 as uuidv4 } from "uuid";
import { computed, h, ref } from "vue";
import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import VDropdownComponent from "~/components/VDropdownComponent.vue";
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
    { key: "table_id", label: "N°", type: "text" },
    { key: "clase_apoderado", label: "Clase de Apoderado", type: "text" },
    { key: "numero_apoderados", label: "No. de apoderados", type: "text" },
  ];

  const ES_CLASE_PROTEGIDA = "Gerente General";

  const claseHeaders: ColumnDef<ClaseApoderadoRow>[] = getColumns<ClaseApoderadoRow>(
    claseColumns
  ).map((column) => {
    if ("accessorKey" in column && column.accessorKey === "clase_apoderado") {
      return {
        ...column,
        cell: ({ row }: CellContext<ClaseApoderadoRow, unknown>) => {
          const value = row.getValue("clase_apoderado") as string;
          const esClaseProtegida = value === ES_CLASE_PROTEGIDA;

          if (!esClaseProtegida) {
            return h("div", {}, value);
          }

          return h("div", { class: "flex items-center gap-2" }, [
            h("span", { class: "text-gray-800 font-medium" }, value),
            h(VDropdownComponent, {
              titleDropdown: "A tener en cuenta",
              messageDropdown: "No se encuentra registrado un gerente general.",
              containerClass: "bg-gray-25",
              titleClass: "font-primary font-bold text-gray-800",
              messageClass: "text-gray-500",
              buttonAddVisible: false,
              tooltipClass: "w-[260px]",
            }),
          ]);
        },
      } as ColumnDef<ClaseApoderadoRow>;
    }

    return column;
  });

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

  const showActionsFor = (row: ClaseApoderadoRow) =>
    row.clase_apoderado !== ES_CLASE_PROTEGIDA;

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
