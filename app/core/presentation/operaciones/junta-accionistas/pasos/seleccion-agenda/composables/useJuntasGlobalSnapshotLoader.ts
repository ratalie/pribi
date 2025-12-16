/**
 * Composable global para cargar automáticamente el snapshot completo
 * en cualquier página del flujo de juntas
 *
 * Este composable se debe llamar desde el layout del flujo para asegurar
 * que el snapshot siempre esté cargado, incluso si no estás en la página
 * que lo necesita directamente.
 *
 * Responsabilidades:
 * - Detectar si estamos en una ruta del flujo de juntas
 * - Cargar snapshot completo del backend automáticamente
 * - Evitar cargas duplicadas
 */

import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

// Flag para evitar cargas duplicadas
let isLoadingGlobal = false;
let lastLoadedFlowId: string | null = null;

export function useJuntasGlobalSnapshotLoader() {
  const route = useRoute();
  const snapshotStore = useSnapshotStore();

  /**
   * Verifica si estamos en una ruta del flujo de juntas
   */
  const isJuntasFlowRoute = (): boolean => {
    return (
      route.path.includes("/junta-accionistas/") &&
      route.params.societyId &&
      route.params.flowId
    );
  };

  /**
   * Obtiene los IDs de la ruta actual
   */
  const getRouteIds = (): { societyId: number | null; flowId: number | null } => {
    const societyIdParam = route.params.societyId;
    const flowIdParam = route.params.flowId;

    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam) && societyIdParam.length > 0
          ? parseInt(societyIdParam[0] as string, 10)
          : null;

    const flowId =
      typeof flowIdParam === "string"
        ? parseInt(flowIdParam, 10)
        : Array.isArray(flowIdParam) && flowIdParam.length > 0
          ? parseInt(flowIdParam[0] as string, 10)
          : null;

    return {
      societyId: Number.isNaN(societyId) ? null : societyId,
      flowId: Number.isNaN(flowId) ? null : flowId,
    };
  };

  /**
   * Carga snapshot desde el backend
   */
  const loadFromBackend = async (societyId: number, flowId: number): Promise<void> => {
    const flowIdString = String(flowId);

    // Evitar cargas duplicadas si ya se cargó para este flowId
    if (isLoadingGlobal && lastLoadedFlowId === flowIdString) {
      console.debug(
        "[useJuntasGlobalSnapshotLoader] Ya se está cargando para este flowId, omitiendo...",
        { flowId }
      );
      return;
    }

    // Si el snapshot es de otro flowId, limpiarlo antes de cargar
    if (
      snapshotStore.snapshot &&
      (snapshotStore.currentFlowId !== flowId || snapshotStore.currentSocietyId !== societyId)
    ) {
      console.debug(
        "[useJuntasGlobalSnapshotLoader] Snapshot es de otro flowId/societyId, limpiando antes de cargar...",
        {
          currentFlowId: snapshotStore.currentFlowId,
          newFlowId: flowId,
          currentSocietyId: snapshotStore.currentSocietyId,
          newSocietyId: societyId,
        }
      );
      // Limpiar snapshot anterior
      snapshotStore.clearSnapshot();
    }

    // Verificar si el store ya tiene snapshot cargado para este flowId
    if (
      snapshotStore.snapshot &&
      snapshotStore.currentFlowId === flowId &&
      snapshotStore.currentSocietyId === societyId
    ) {
      console.debug(
        "[useJuntasGlobalSnapshotLoader] Snapshot ya está cargado para este flowId, omitiendo carga duplicada...",
        {
          flowId,
          societyId,
          hasSnapshot: !!snapshotStore.snapshot,
        }
      );
      lastLoadedFlowId = flowIdString;
      return;
    }

    // Si ya se intentó cargar para este flowId, no recargar
    if (lastLoadedFlowId === flowIdString) {
      console.debug(
        "[useJuntasGlobalSnapshotLoader] Ya se intentó cargar para este flowId, omitiendo...",
        { flowId }
      );
      return;
    }

    try {
      isLoadingGlobal = true;
      lastLoadedFlowId = flowIdString;

      console.debug("[useJuntasGlobalSnapshotLoader] Cargando snapshot desde backend...", {
        societyId,
        flowId,
      });

      // Cargar desde el backend
      await snapshotStore.loadSnapshot(societyId, flowId);

      console.debug("[useJuntasGlobalSnapshotLoader] Snapshot cargado exitosamente", {
        flowId,
        hasSnapshot: !!snapshotStore.snapshot,
        accionistas: snapshotStore.snapshot?.shareholders.length || 0,
      });
    } catch (error) {
      console.error("[useJuntasGlobalSnapshotLoader] Error al cargar snapshot:", error);
      // No lanzar error, solo loguear (el snapshot puede no ser crítico en todas las páginas)
    } finally {
      isLoadingGlobal = false;
    }
  };

  /**
   * Inicializa automáticamente cuando detecta que estamos en una ruta del flujo
   */
  const initialize = async (): Promise<void> => {
    if (!isJuntasFlowRoute()) {
      return;
    }

    const { societyId, flowId } = getRouteIds();

    if (!societyId || !flowId) {
      console.debug(
        "[useJuntasGlobalSnapshotLoader] No hay IDs válidos, omitiendo carga...",
        { societyId, flowId }
      );
      return;
    }

    // Cargar desde el backend
    await loadFromBackend(societyId, flowId);
  };

  /**
   * Reinicia el estado de carga (útil cuando cambias de flowId)
   */
  const resetLoader = () => {
    lastLoadedFlowId = null;
    isLoadingGlobal = false;
    // Limpiar snapshot si cambia el flowId
    snapshotStore.clearSnapshot();
  };

  // Observar cambios en la ruta para recargar si cambia el flowId
  watch(
    () => [route.params.societyId, route.params.flowId],
    async ([newSocietyId, newFlowId], [oldSocietyId, oldFlowId]) => {
      // Solo recargar si cambió el flowId (no solo la sociedad)
      if (newFlowId !== oldFlowId && newSocietyId && newFlowId) {
        resetLoader();
        await initialize();
      }
    },
    { immediate: false }
  );

  // Inicializar al montar
  onMounted(() => {
    initialize();
  });

  return {
    initialize,
    resetLoader,
  };
}



