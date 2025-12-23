/**
 * Controller para la vista de Historial de Sociedades
 * 
 * Orquesta la lógica de la vista y coordina con el store
 */

import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
import type { TableAction } from "~/types/tables/table-config";
import type { EstadoSociedad, HistorialTableAction } from "../types/historial.types";

export function useHistorialSociedades() {
  const router = useRouter();
  const historialStore = useSociedadHistorialStore();
  const { sociedades, status, errorMessage } = storeToRefs(historialStore);

  const isLoading = computed(() => status.value === "loading");

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

  const handleDelete = async (sociedad: SociedadResumenDTO) => {
    const confirmed = window.confirm("¿Deseas eliminar este registro de sociedad?");
    if (!confirmed) return;
    await historialStore.eliminarSociedad(sociedad.idSociety);
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

    await historialStore.eliminarTodasLasSociedades();
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
      handler: (rowData: SociedadResumenDTO) => handleDelete(rowData),
    },
  ];

  // Cargar datos al montar
  onMounted(() => {
    historialStore.cargarHistorial();
  });

  return {
    // State
    sociedades,
    isLoading,
    errorMessage,
    // Methods
    getEstado,
    formatPasoActual,
    goToPreview,
    goToEdit,
    handleDelete,
    goToTestPage,
    handleDeleteAll,
    handleCreate,
    tableActions,
  };
}

