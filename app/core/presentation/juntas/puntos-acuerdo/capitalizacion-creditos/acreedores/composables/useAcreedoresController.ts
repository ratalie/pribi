import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAcreedoresStore } from "../stores/useAcreedoresStore";

/**
 * Controller para la página de Acreedores
 *
 * Responsabilidades:
 * - Cargar acreedores desde backend
 * - Gestionar estado de carga
 * - Proporcionar datos a la vista
 */
export function useAcreedoresController() {
  const route = useRoute();
  const acreedoresStore = useAcreedoresStore();

  const isLoading = computed(() => acreedoresStore.status === "loading");
  const error = computed(() => acreedoresStore.errorMessage);
  const acreedores = computed(() => acreedoresStore.acreedores);

  /**
   * Cargar acreedores desde backend
   */
  async function loadAcreedores() {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    if (!societyId || !flowId) {
      console.warn("[AcreedoresController] No hay societyId o flowId en la ruta");
      return;
    }

    try {
      console.log("[AcreedoresController] Cargando acreedores desde backend...");
      await acreedoresStore.loadAcreedores(societyId, flowId);
      console.log("[AcreedoresController] Acreedores cargados:", acreedores.value.length);
    } catch (error: any) {
      console.error("[AcreedoresController] Error al cargar acreedores:", error);
      throw error;
    }
  }

  // Cargar acreedores al montar
  onMounted(() => {
    loadAcreedores();
  });

  return {
    acreedores,
    isLoading,
    error,
    loadAcreedores,
  };
}



