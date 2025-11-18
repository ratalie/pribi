import { computed, ref } from "vue";
import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
import { useAccionesComunesStore } from "../stores/useAccionesComunesStore";
import { useClasesAccionesStore } from "../stores/useClasesAccionesStore";
import { useRegistroAccionesStore } from "../stores/useRegistroAccionesStore";
import { useValorNominalStore } from "../stores/useValorNominalStore";
import type { AccionTableRow } from "../types/acciones";

export const useAccionesComputed = () => {
  const valorNominalStore = useValorNominalStore();
  const registroAccionesStore = useRegistroAccionesStore();
  const accionesComunesStore = useAccionesComunesStore();
  const clasesAccionesStore = useClasesAccionesStore();

  // Configuración de columnas de la tabla
  const societyHeaders: TableColumn<AccionTableRow>[] = [
    { key: "tipo_acciones", label: "Tipo de Acciones", type: "text" },
    { key: "acciones_suscritas", label: "Acciones Suscritas", type: "text" },
    { key: "participacion", label: "Participación", type: "text" },
    { key: "derecho_voto", label: "Derecho a Voto", type: "icons", icons: ["Check", "X"] },
    { key: "redimibles", label: "Redimibles", type: "icons", icons: ["Check", "X"] },
    {
      key: "derechos_especiales",
      label: "Derechos Especiales",
      type: "icons",
      icons: ["FileCheck", "X"],
    },
    {
      key: "obligaciones_adicionales",
      label: "Obligaciones Adicionales",
      type: "icons",
      icons: ["FileCheck", "X"],
    },
  ];

  const columns = getColumns(societyHeaders);

  // Formateador de moneda
  const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Datos computados
  const accionesData = computed(() => registroAccionesStore.tablaAcciones);
  const totalAcciones = computed(() => registroAccionesStore.totalAcciones);
  const totalTipos = computed(() => registroAccionesStore.totalTipos);
  const capitalSocial = computed(() => valorNominalStore.valor * totalAcciones.value);

  // Displays formateados
  const totalAccionesDisplay = computed(() => totalAcciones.value.toLocaleString("es-PE"));
  const totalTiposDisplay = computed(() => totalTipos.value.toString());
  const capitalSocialDisplay = computed(() =>
    currencyFormatter.format(capitalSocial.value || 0)
  );
  const valorNominalDisplay = computed(() =>
    currencyFormatter.format(valorNominalStore.valor || 0)
  );

  // Estado de modales
  const isValorNominalModalOpen = ref(false);
  const isAccionesModalOpen = ref(false);
  const accionesModalMode = ref<"crear" | "editar">("crear");
  const accionSeleccionadaId = ref<string | null>(null);

  // Funciones de utilidad
  const resetAccionForms = () => {
    accionesComunesStore.$reset();
    clasesAccionesStore.$reset();
  };

  // Funciones de modales
  const openValorNominalModal = () => {
    isValorNominalModalOpen.value = true;
  };

  const openAccionesModal = () => {
    resetAccionForms();
    accionesModalMode.value = "crear";
    accionSeleccionadaId.value = null;
    isAccionesModalOpen.value = true;
  };

  const closeValorNominalModal = () => {
    isValorNominalModalOpen.value = false;
  };

  const closeAccionesModal = () => {
    isAccionesModalOpen.value = false;
  };

  // Funciones de acciones
  const handleEditAccion = (id: string) => {
    const accion = registroAccionesStore.getAccionById(id);

    if (!accion) {
      return;
    }

    resetAccionForms();
    accionesModalMode.value = "editar";
    accionSeleccionadaId.value = id;
    isAccionesModalOpen.value = true;
  };

  const handleDeleteAccion = (id: string) => {
    registroAccionesStore.removeAccion(id);
  };

  const accionesActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditAccion,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleDeleteAccion,
    },
  ];

  return {
    // Columnas
    columns,
    // Datos
    accionesData,
    totalAcciones,
    totalTipos,
    capitalSocial,
    // Displays
    totalAccionesDisplay,
    totalTiposDisplay,
    capitalSocialDisplay,
    valorNominalDisplay,
    // Modales
    isValorNominalModalOpen,
    isAccionesModalOpen,
    accionesModalMode,
    accionSeleccionadaId,
    openValorNominalModal,
    openAccionesModal,
    closeValorNominalModal,
    closeAccionesModal,
    // Acciones
    accionesActions,
    // Stores (para acceso directo si es necesario)
    valorNominalStore,
    registroAccionesStore,
  };
};
