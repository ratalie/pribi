import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCapitalizacionesStore } from "../stores/useCapitalizacionesStore";

/**
 * Controller para la página de Créditos (Capitalizaciones)
 *
 * Responsabilidades:
 * - Cargar capitalizaciones desde backend
 * - Gestionar estado de carga
 * - Proporcionar datos a la vista
 */
export function useCapitalizacionesController() {
  const route = useRoute();
  const capitalizacionesStore = useCapitalizacionesStore();

  const isLoading = computed(() => capitalizacionesStore.status === "loading");
  const error = computed(() => capitalizacionesStore.errorMessage);
  const capitalizaciones = computed(() => capitalizacionesStore.capitalizaciones);

  /**
   * Cargar capitalizaciones desde backend
   */
  async function loadCapitalizaciones() {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    if (!societyId || !flowId) {
      console.warn("[CapitalizacionesController] No hay societyId o flowId en la ruta");
      return;
    }

    try {
      console.log("[CapitalizacionesController] Cargando capitalizaciones desde backend...");
      await capitalizacionesStore.loadCapitalizaciones(societyId, flowId);
      console.log(
        "[CapitalizacionesController] Capitalizaciones cargadas:",
        capitalizaciones.value.length
      );
    } catch (error: any) {
      console.error("[CapitalizacionesController] Error al cargar capitalizaciones:", error);
      throw error;
    }
  }

  // Cargar capitalizaciones al montar
  onMounted(() => {
    loadCapitalizaciones();
  });

  return {
    capitalizaciones,
    isLoading,
    error,
    loadCapitalizaciones,
  };
}



