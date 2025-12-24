/**
 * Controller para la vista de Historial de Sociedades
 *
 * Orquesta la lógica de la vista y coordina con el store
 */

import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
import type { TableAction } from "~/types/tables/table-config";
import type { EstadoSociedad } from "../types/historial.types";

export function useHistorialSociedades() {
  const router = useRouter();
  const historialStore = useSociedadHistorialStore();
  const searchQuery = ref("");
  const selectedTipo = ref("all");
  const selectedEstado = ref("all");
  const deleteModalOpen = ref(false);
  const sociedadToDelete = ref<SociedadResumenDTO | null>(null);
  const isDeleting = ref(false);

  const isLoading = computed(() => (historialStore as any).status === "loading");
  const errorMessage = computed(() => (historialStore as any).errorMessage);

  // Formatear fecha
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "—";
    try {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "—";
    }
  };

  // Filtrar sociedades según búsqueda, tipo y estado
  const sociedades = computed(() => {
    let filtered = (historialStore as any).sociedades as SociedadResumenDTO[];

    // Filtro de búsqueda
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim();
      filtered = filtered.filter((sociedad) => {
        const razonSocial = (sociedad.razonSocial || "").toLowerCase();
        const nombreComercial = (sociedad.nombreComercial || "").toLowerCase();
        const ruc = (sociedad.ruc || "").toLowerCase();
        const tipoSocietario = (sociedad.tipoSocietario || "").toLowerCase();

        return (
          razonSocial.includes(query) ||
          nombreComercial.includes(query) ||
          ruc.includes(query) ||
          tipoSocietario.includes(query)
        );
      });
    }

    // Filtro de tipo
    if (selectedTipo.value !== "all") {
      filtered = filtered.filter(
        (sociedad: SociedadResumenDTO) => sociedad.tipoSocietario === selectedTipo.value
      );
    }

    // Filtro de estado
    if (selectedEstado.value !== "all") {
      filtered = filtered.filter((sociedad: SociedadResumenDTO) => {
        const estado = getEstado(sociedad);
        if (selectedEstado.value === "completado") {
          return estado.isComplete;
        }
        if (selectedEstado.value === "pendiente") {
          return !estado.isComplete;
        }
        return true;
      });
    }

    return filtered;
  });

  const pasoLabels: Record<SocietyRegisterStep, string> = {
    [SocietyRegisterStep.DATOS_SOCIEDAD]: "Datos principales",
    [SocietyRegisterStep.ACCIONISTAS]: "Accionistas",
    [SocietyRegisterStep.ACCIONES]: "Acciones",
    [SocietyRegisterStep.ASIGNACION_ACCIONES]: "Asignación de acciones",
    [SocietyRegisterStep.DIRECTORIO]: "Directorio",
    [SocietyRegisterStep.REGISTRO_APODERADOS]: "Registro apoderados",
    [SocietyRegisterStep.REGIMEN_PODERES]: "Régimen de poderes",
    [SocietyRegisterStep.QUORUMS_MAYORIAS]: "Quórums y mayorías",
    [SocietyRegisterStep.ACUERDOS_SOCIETARIOS]: "Acuerdos societarios",
    [SocietyRegisterStep.RESUMEN]: "Resumen",
    [SocietyRegisterStep.FINALIZAR]: "Finalizado",
  };

  const formatPasoActual = (paso: SocietyRegisterStep | string | undefined): string => {
    if (!paso) return "—";
    const normalized = paso as SocietyRegisterStep;
    return pasoLabels[normalized] ?? paso.replace(/-/g, " ");
  };

  const getEstado = (sociedad: SociedadResumenDTO): EstadoSociedad => {
    const paso = sociedad.pasoActual;
    if (paso === SocietyRegisterStep.FINALIZAR) {
      return { label: "Completado", isComplete: true };
    }
    return { label: "Pendiente", isComplete: false };
  };

  const goToPreview = (id: string) => {
    router.push(`/registros/sociedades/${id}/preview`);
  };

  const goToEdit = (id: string) => {
    router.push(`/registros/sociedades/${id}/datos-sociedad`);
  };

  const openDeleteModal = (sociedad: SociedadResumenDTO) => {
    sociedadToDelete.value = sociedad;
    deleteModalOpen.value = true;
  };

  const handleDelete = async () => {
    if (!sociedadToDelete.value) return;

    isDeleting.value = true;
    try {
      await (historialStore as any).eliminarSociedad(sociedadToDelete.value.idSociety);
      deleteModalOpen.value = false;
      sociedadToDelete.value = null;
    } catch (error) {
      console.error("Error al eliminar sociedad:", error);
    } finally {
      isDeleting.value = false;
    }
  };

  const closeDeleteModal = () => {
    deleteModalOpen.value = false;
    sociedadToDelete.value = null;
  };

  const goToTestPage = () => {
    router.push("/dev/seeds-sociedades");
  };

  const handleDeleteAll = async () => {
    if (sociedades.value.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar TODAS las ${sociedades.value.length} sociedades registradas? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    await (historialStore as any).eliminarTodasLasSociedades();
  };

  const handleCreate = () => {
    router.push("/registros/sociedades/agregar");
  };

  const tableActions: TableAction[] = [
    {
      id: "preview",
      label: "Previsualizar",
      icon: "Eye",
      handler: (rowData: SociedadResumenDTO) => goToPreview(rowData.idSociety),
    },
    {
      id: "edit",
      label: "Editar datos",
      icon: "Pencil",
      handler: (rowData: SociedadResumenDTO) => goToEdit(rowData.idSociety),
    },
    {
      id: "delete",
      label: "Eliminar registro",
      icon: "Trash2",
      destructive: true,
      handler: (rowData: SociedadResumenDTO) => openDeleteModal(rowData),
    },
  ];

  // Cargar datos al montar
  onMounted(() => {
    (historialStore as any).cargarHistorial();
  });

  return {
    // State
    sociedades,
    isLoading,
    errorMessage,
    searchQuery,
    selectedTipo,
    selectedEstado,
    deleteModalOpen,
    sociedadToDelete,
    isDeleting,
    // Methods
    getEstado,
    formatPasoActual,
    formatDate,
    goToPreview,
    goToEdit,
    openDeleteModal,
    handleDelete,
    closeDeleteModal,
    goToTestPage,
    handleDeleteAll,
    handleCreate,
    tableActions,
  };
}
