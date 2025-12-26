/**
 * Controller para la vista de Historial de Juntas
 */

import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";
import type { TableAction } from "~/types/tables/table-config";
import type { EstadoJunta } from "../types/historial.types";

export function useHistorialJuntas() {
  const router = useRouter();
  const sociedadStore = useSociedadHistorialStore();
  const juntaStore = useJuntaHistorialStore();
  const { sociedades: sociedadesRef } = storeToRefs(sociedadStore);
  const { juntas, status, errorMessage } = storeToRefs(juntaStore);

  // Asegurar que sociedades siempre sea un array
  const sociedades = computed(() => {
    return Array.isArray(sociedadesRef.value) ? sociedadesRef.value : [];
  });

  const selectedSocietyId = ref<number | null>(null);
  const isLoadingSociedades = ref(false);

  const isLoading = computed(() => status.value === "loading");

  const formatDate = (isoString: string | null | undefined) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    const dateOnly = isoString.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    return `${day}/${month}/${year}`;
  };

  /**
   * Obtiene la fecha de la junta
   * Usa fechaJunta del backend (fecha de primera convocatoria) o createdAt como fallback
   */
  const getFechaJunta = (junta: JuntaResumenDTO): string => {
    // Priorizar fechaJunta (fecha de primera convocatoria) si está disponible
    if (junta.fechaJunta) {
      return formatDate(junta.fechaJunta);
    }
    // Fallback a createdAt si no hay fecha de junta
    return formatDate(junta.createdAt);
  };

  /**
   * Obtiene el nombre de la junta
   * Si tiene nombre personalizado, lo devuelve. Si no, devuelve nombre por defecto
   */
  const getNombreJunta = (junta: JuntaResumenDTO): string => {
    // Si la junta tiene nombre personalizado, devolverlo
    if (junta.juntaNombrada && junta.nombreJunta) {
      return junta.nombreJunta;
    }
    // Valor por defecto basado en tipo
    if (junta.esAnualObligatoria) {
      return "Junta Obligatoria Anual";
    }
    return "Junta Ordinaria";
  };

  /**
   * Obtiene el tipo de junta
   */
  const getTipoJunta = (junta: JuntaResumenDTO): string => {
    if (junta.esAnualObligatoria) {
      return "Junta Obligatoria Anual";
    }
    return "Ordinaria";
  };

  const getEstado = (junta: JuntaResumenDTO): EstadoJunta => {
    const estado = junta.estado;
    if (estado === "FINALIZADO") {
      return { label: "FINALIZADO", isComplete: true, isEnProceso: false };
    }
    if (estado === "EN_PROCESO") {
      return { label: "EN PROCESO", isComplete: false, isEnProceso: true };
    }
    return { label: "BORRADOR", isComplete: false, isEnProceso: false };
  };

  const handleSocietyChange = async (societyId: number | null) => {
    selectedSocietyId.value = societyId;
    if (societyId) {
      await juntaStore.cargarHistorial(societyId);
    }
  };

  const goToEdit = (junta: JuntaResumenDTO) => {
    if (!selectedSocietyId.value) return;
    juntaStore.setSelectedSocietyId(selectedSocietyId.value);
    router.push(
      `/operaciones/sociedades/${selectedSocietyId.value}/junta-accionistas/${junta.id}/seleccion-agenda`
    );
  };

  const handleDelete = async (junta: JuntaResumenDTO) => {
    if (!selectedSocietyId.value) return;
    const confirmed = window.confirm("¿Deseas eliminar esta junta de accionistas?");
    if (!confirmed) return;
    await juntaStore.eliminarJunta(selectedSocietyId.value, junta.id);
  };

  const handleCreate = () => {
    if (selectedSocietyId.value) {
      router.push(`/operaciones/sociedades/${selectedSocietyId.value}/junta-accionistas/crear`);
    }
  };

  const tableActions: TableAction[] = [
    {
      id: "edit",
      label: "Editar",
      icon: "Pencil",
      handler: (rowData: JuntaResumenDTO) => goToEdit(rowData),
    },
    {
      id: "delete",
      label: "Eliminar",
      icon: "Trash2",
      destructive: true,
      handler: (rowData: JuntaResumenDTO) => handleDelete(rowData),
    },
  ];

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadStore.cargarHistorial();
      if (selectedSocietyId.value) {
        await juntaStore.cargarHistorial(selectedSocietyId.value);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      isLoadingSociedades.value = false;
    }
  });

  return {
    // State
    sociedades,
    juntas,
    isLoading,
    isLoadingSociedades,
    errorMessage,
    selectedSocietyId,
    // Methods
    getEstado,
    formatDate,
    getFechaJunta,
    getNombreJunta,
    getTipoJunta,
    handleSocietyChange,
    handleCreate,
    tableActions,
  };
}




