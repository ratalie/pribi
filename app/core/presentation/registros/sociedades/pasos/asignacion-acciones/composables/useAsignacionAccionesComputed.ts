import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useRegistroAccionesStore } from "../../acciones/stores/useRegistroAccionesStore";
import { useValorNominalStore } from "../../acciones/stores/useValorNominalStore";
import { useRegistroAsignacionAccionesStore } from "../stores/useRegistroAsignacionAccionesStore";
import type { AsignacionAccionistaTableRow } from "../types/asignacion-acciones";

export const useAsignacionAccionesComputed = () => {
  const route = useRoute();
  const asignacionAccionesStore = useRegistroAsignacionAccionesStore();
  const registroAccionesStore = useRegistroAccionesStore();
  const valorNominalStore = useValorNominalStore();

  // Obtener societyProfileId de route
  const societyProfileId = computed(() => {
    return (route.params.id as string | undefined) || "";
  });

  // Formateador de moneda
  const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Datos computados
  const asignacionesData = computed<AsignacionAccionistaTableRow[]>(
    () => asignacionAccionesStore.tablaAsignaciones
  );
  const accionesDisponibles = computed(() => asignacionAccionesStore.accionesDisponibles);
  const totalAccionesAsignadas = computed(
    () => asignacionAccionesStore.totalAccionesAsignadas
  );
  const totalAccionesSociedad = computed(() => asignacionAccionesStore.totalAccionesSociedad);
  const capitalSocial = computed(() => asignacionAccionesStore.capitalSocial);

  // Displays formateados
  const totalAccionesAsignadasDisplay = computed(() =>
    totalAccionesAsignadas.value.toLocaleString("es-PE")
  );
  const totalAccionesSociedadDisplay = computed(() =>
    totalAccionesSociedad.value.toLocaleString("es-PE")
  );
  const capitalSocialDisplay = computed(() =>
    currencyFormatter.format(capitalSocial.value || 0)
  );
  const valorNominalDisplay = computed(() =>
    currencyFormatter.format(valorNominalStore.valor || 0)
  );

  // Estado de modales
  const isAsignacionModalOpen = ref(false);
  const asignacionModalMode = ref<"crear" | "editar">("crear");
  const accionistaSeleccionadoId = ref<string | null>(null);
  const accionSeleccionadaId = ref<string | null>(null);

  // Funciones de modales
  const openAsignacionModal = (accionistaId: string) => {
    accionistaSeleccionadoId.value = accionistaId;
    asignacionModalMode.value = "crear";
    accionSeleccionadaId.value = null;
    isAsignacionModalOpen.value = true;
  };

  const closeAsignacionModal = () => {
    isAsignacionModalOpen.value = false;
    accionistaSeleccionadoId.value = null;
    accionSeleccionadaId.value = null;
  };

  // Funciones de acciones
  const handleEditAsignacion = (accionistaId: string, accionId: string) => {
    const asignacionAccion = asignacionAccionesStore.getAsignacionAccionById(
      accionistaId,
      accionId
    );

    if (!asignacionAccion) {
      return;
    }

    accionistaSeleccionadoId.value = accionistaId;
    asignacionModalMode.value = "editar";
    accionSeleccionadaId.value = accionId;
    isAsignacionModalOpen.value = true;
  };

  const handleDeleteAsignacion = async (accionistaId: string, accionId: string) => {
    const profileId = societyProfileId.value;
    if (!profileId) {
      console.error("No hay societyProfileId disponible para eliminar asignación");
      return;
    }
    await asignacionAccionesStore.removeAsignacionAccion(profileId, accionistaId, accionId);
  };

  // Acciones para la tabla
  const asignacionActions = computed(() => [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (itemId: string, accionId?: string) => {
        if (accionId) {
          handleEditAsignacion(itemId, accionId);
        }
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (itemId: string, accionId?: string) => {
        if (accionId) {
          handleDeleteAsignacion(itemId, accionId);
        }
      },
    },
  ]);

  return {
    // Datos
    asignacionesData,
    accionesDisponibles,
    totalAccionesAsignadas,
    totalAccionesSociedad,
    capitalSocial,
    // Displays
    totalAccionesAsignadasDisplay,
    totalAccionesSociedadDisplay,
    capitalSocialDisplay,
    valorNominalDisplay,
    // Modales
    isAsignacionModalOpen,
    asignacionModalMode,
    accionistaSeleccionadoId,
    accionSeleccionadaId,
    openAsignacionModal,
    closeAsignacionModal,
    // Acciones
    asignacionActions,
    handleEditAsignacion,
    handleDeleteAsignacion,
    // Stores (para acceso directo si es necesario)
    asignacionAccionesStore,
    registroAccionesStore,
    valorNominalStore,
  };
};
