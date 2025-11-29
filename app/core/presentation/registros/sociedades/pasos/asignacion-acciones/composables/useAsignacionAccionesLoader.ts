import type { MaybeRef } from "vue";
import { computed, onMounted, ref, unref, watch } from "vue";
import { useRoute } from "vue-router";
import { useRegistroAccionistasStore } from "~/modules/registro-sociedades/stores/useRegistroAccionistasStore";
import { useRegistroAccionesStore } from "../../acciones/stores/useRegistroAccionesStore";
import { useValorNominalStore } from "../../acciones/stores/useValorNominalStore";
import { useRegistroAsignacionAccionesStore } from "../stores/useRegistroAsignacionAccionesStore";

interface Options {
  societyId?: MaybeRef<string>;
}

/**
 * Composable que carga automáticamente acciones y accionistas desde el backend
 * cuando el componente se monta o cuando cambia el societyId
 */
export const useAsignacionAccionesLoader = (options: Options = {}) => {
  const route = useRoute();
  const registroAccionesStore = useRegistroAccionesStore();
  const registroAccionistasStore = useRegistroAccionistasStore();
  const valorNominalStore = useValorNominalStore();
  const registroAsignacionAccionesStore = useRegistroAsignacionAccionesStore();

  // Obtener societyId de props o route
  const societyId = computed(() => {
    const propValue =
      typeof options.societyId === "object" ? unref(options.societyId) : options.societyId;
    return propValue || (route.params.id as string | undefined) || "";
  });

  // Estados de carga
  const isLoadingAcciones = ref(false);
  const isLoadingAccionistas = ref(false);
  const isLoadingValorNominal = ref(false);
  const errorAcciones = ref<Error | null>(null);
  const errorAccionistas = ref<Error | null>(null);
  const errorValorNominal = ref<Error | null>(null);

  // Estado general de carga
  const isLoading = computed(
    () => isLoadingAcciones.value || isLoadingAccionistas.value || isLoadingValorNominal.value
  );

  // Función para cargar todas las datos
  const loadAll = async () => {
    const profileId = societyId.value;
    if (!profileId) {
      console.warn("[useAsignacionAccionesLoader] No hay profileId disponible");
      return;
    }

    // Cargar en paralelo
    await Promise.all([
      loadAcciones(profileId),
      loadAccionistas(profileId),
      loadValorNominal(profileId),
    ]);
  };

  // Función para cargar acciones
  const loadAcciones = async (profileId: string) => {
    if (!profileId) return;

    isLoadingAcciones.value = true;
    errorAcciones.value = null;

    try {
      await registroAccionesStore.loadAcciones(profileId);
    } catch (error) {
      console.error("[useAsignacionAccionesLoader] Error al cargar acciones:", error);
      errorAcciones.value = error instanceof Error ? error : new Error(String(error));
    } finally {
      isLoadingAcciones.value = false;
    }
  };

  // Función para cargar accionistas
  const loadAccionistas = async (profileId: string) => {
    if (!profileId) return;

    isLoadingAccionistas.value = true;
    errorAccionistas.value = null;

    try {
      await registroAccionistasStore.loadAccionistas(profileId);
      // Después de cargar los accionistas, inicializar las asignaciones
      registroAsignacionAccionesStore.initializeFromAccionistas();
    } catch (error) {
      console.error("[useAsignacionAccionesLoader] Error al cargar accionistas:", error);
      errorAccionistas.value = error instanceof Error ? error : new Error(String(error));
    } finally {
      isLoadingAccionistas.value = false;
    }
  };

  // Función para cargar valor nominal
  const loadValorNominal = async (profileId: string) => {
    if (!profileId) return;

    isLoadingValorNominal.value = true;
    errorValorNominal.value = null;

    try {
      await valorNominalStore.load(profileId);
    } catch (error) {
      console.error("[useAsignacionAccionesLoader] Error al cargar valor nominal:", error);
      errorValorNominal.value = error instanceof Error ? error : new Error(String(error));
    } finally {
      isLoadingValorNominal.value = false;
    }
  };

  // Cargar datos cuando se monta el componente
  onMounted(() => {
    if (societyId.value) {
      loadAll();
    }
  });

  // Recargar cuando cambie el societyId
  watch(societyId, (newId) => {
    if (newId) {
      loadAll();
    }
  });

  return {
    // Estados
    societyId,
    isLoading,
    isLoadingAcciones,
    isLoadingAccionistas,
    isLoadingValorNominal,
    errorAcciones,
    errorAccionistas,
    errorValorNominal,
    // Funciones
    loadAll,
    loadAcciones,
    loadAccionistas,
    loadValorNominal,
    // Stores (para acceso directo si es necesario)
    registroAccionesStore,
    registroAccionistasStore,
    valorNominalStore,
    registroAsignacionAccionesStore,
  };
};
