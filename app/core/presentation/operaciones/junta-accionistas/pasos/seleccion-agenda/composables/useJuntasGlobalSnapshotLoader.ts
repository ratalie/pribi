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
  console.log("🔵 [useJuntasGlobalSnapshotLoader] Composable inicializado");
  const route = useRoute();
  const snapshotStore = useSnapshotStore();

  // Verificar si hay snapshot en localStorage al inicializar
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("probo-snapshot");
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log(
          "📦 [useJuntasGlobalSnapshotLoader] Snapshot encontrado en localStorage:",
          {
            hasSnapshot: !!parsed?.state?.snapshot,
            storedFlowId: parsed?.state?.currentFlowId,
            storedSocietyId: parsed?.state?.currentSocietyId,
            storeStatus: parsed?.state?.status,
          }
        );
      }
    } catch (e) {
      // Ignorar errores
    }
  }

  console.log("🔵 [useJuntasGlobalSnapshotLoader] Ruta actual:", {
    path: route.path,
    params: route.params,
    fullPath: route.fullPath,
  });

  /**
   * Verifica si estamos en una ruta del flujo de juntas
   */
  const isJuntasFlowRoute = (): boolean => {
    const hasPath = route.path.includes("/junta-accionistas/");
    const hasSocietyId = !!route.params.societyId;
    const hasFlowId = !!route.params.flowId;
    const result = hasPath && hasSocietyId && hasFlowId;

    console.log("🔵 [useJuntasGlobalSnapshotLoader] isJuntasFlowRoute()", {
      hasPath,
      hasSocietyId,
      hasFlowId,
      result,
      path: route.path,
      societyId: route.params.societyId,
      flowId: route.params.flowId,
    });

    return result;
  };

  /**
   * Obtiene los IDs de la ruta actual
   */
  const getRouteIds = (): { societyId: number | null; flowId: number | null } => {
    const societyIdParam = route.params.societyId;
    const flowIdParam = route.params.flowId;

    console.log("🔵 [useJuntasGlobalSnapshotLoader] getRouteIds() - Params raw:", {
      societyIdParam,
      flowIdParam,
      societyIdType: typeof societyIdParam,
      flowIdType: typeof flowIdParam,
    });

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

    const result = {
      societyId: Number.isNaN(societyId) ? null : societyId,
      flowId: Number.isNaN(flowId) ? null : flowId,
    };

    console.log("🔵 [useJuntasGlobalSnapshotLoader] getRouteIds() - Result:", result);

    return result;
  };

  /**
   * Carga snapshot desde el backend
   * @param forceReload Si es true, fuerza la recarga incluso si ya existe un snapshot
   */
  const loadFromBackend = async (
    societyId: number,
    flowId: number,
    forceReload: boolean = false
  ): Promise<void> => {
    console.log("🟢 [useJuntasGlobalSnapshotLoader] loadFromBackend() INICIADO", {
      societyId,
      flowId,
      forceReload,
      isLoadingGlobal,
      lastLoadedFlowId,
    });

    const flowIdString = String(flowId);

    // Evitar cargas duplicadas si ya se cargó para este flowId
    if (isLoadingGlobal && lastLoadedFlowId === flowIdString) {
      console.warn(
        "🟡 [useJuntasGlobalSnapshotLoader] Ya se está cargando para este flowId, omitiendo...",
        { flowId, isLoadingGlobal, lastLoadedFlowId }
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
    const storeState = {
      hasSnapshot: !!snapshotStore.snapshot,
      currentFlowId: snapshotStore.currentFlowId,
      currentSocietyId: snapshotStore.currentSocietyId,
      requestedFlowId: flowId,
      requestedSocietyId: societyId,
      matches:
        snapshotStore.currentFlowId === flowId && snapshotStore.currentSocietyId === societyId,
      snapshotKeys: snapshotStore.snapshot ? Object.keys(snapshotStore.snapshot) : [],
      snapshotFromLocalStorage: false, // Intentaremos detectar esto
    };

    // Intentar detectar si viene de localStorage
    if (typeof window !== "undefined" && snapshotStore.snapshot) {
      try {
        const stored = localStorage.getItem("probo-snapshot");
        if (stored) {
          const parsed = JSON.parse(stored);
          storeState.snapshotFromLocalStorage = !!parsed?.state?.snapshot;
        }
      } catch (e) {
        // Ignorar errores de parseo
      }
    }

    console.log(
      "🟢 [useJuntasGlobalSnapshotLoader] Verificando estado del store:",
      storeState
    );

    if (
      !forceReload &&
      snapshotStore.snapshot &&
      snapshotStore.currentFlowId === flowId &&
      snapshotStore.currentSocietyId === societyId
    ) {
      console.warn(
        "🟡 [useJuntasGlobalSnapshotLoader] Snapshot ya está cargado para este flowId, omitiendo carga duplicada...",
        {
          flowId,
          societyId,
          hasSnapshot: !!snapshotStore.snapshot,
          fromLocalStorage: storeState.snapshotFromLocalStorage,
          forceReload,
          message:
            "El snapshot ya existe. Para forzar recarga: snapshotStore.clearSnapshot() o recarga la página",
          action: "OMITIENDO FETCH - Snapshot existe en store",
        }
      );
      console.log(
        "💡 [useJuntasGlobalSnapshotLoader] Para forzar recarga, ejecuta en consola:",
        "const snapshotStore = useSnapshotStore(); snapshotStore.clearSnapshot(); location.reload();"
      );
      lastLoadedFlowId = flowIdString;
      return;
    }

    if (forceReload) {
      console.log(
        "🔄 [useJuntasGlobalSnapshotLoader] FORZANDO recarga del snapshot (forceReload=true)"
      );
    }

    // Si ya se intentó cargar para este flowId Y el snapshot está cargado, no recargar
    // Pero si falló la carga anterior, permitir reintentar
    if (lastLoadedFlowId === flowIdString && snapshotStore.snapshot) {
      console.warn(
        "🟡 [useJuntasGlobalSnapshotLoader] Ya se intentó cargar para este flowId y hay snapshot, omitiendo...",
        { flowId, lastLoadedFlowId, hasSnapshot: !!snapshotStore.snapshot }
      );
      return;
    }

    try {
      console.log("🟢 [useJuntasGlobalSnapshotLoader] INICIANDO CARGA DEL SNAPSHOT...", {
        societyId,
        flowId,
        url: `http://localhost:3000/api/v2/society-profile/${societyId}/register-assembly/${flowId}/snapshot/complete`,
      });

      isLoadingGlobal = true;
      lastLoadedFlowId = flowIdString;

      console.log(
        "🟢 [useJuntasGlobalSnapshotLoader] Llamando snapshotStore.loadSnapshot()...",
        {
          societyId,
          flowId,
        }
      );

      // Cargar desde el backend
      await snapshotStore.loadSnapshot(societyId, flowId);

      console.log("✅ [useJuntasGlobalSnapshotLoader] Snapshot cargado exitosamente", {
        flowId,
        hasSnapshot: !!snapshotStore.snapshot,
        accionistas: snapshotStore.snapshot?.shareholders.length || 0,
      });
    } catch (error) {
      console.error("❌ [useJuntasGlobalSnapshotLoader] Error al cargar snapshot:", error);
      // No lanzar error, solo loguear (el snapshot puede no ser crítico en todas las páginas)
    } finally {
      isLoadingGlobal = false;
      console.log("🟢 [useJuntasGlobalSnapshotLoader] loadFromBackend() FINALIZADO", {
        isLoadingGlobal,
        lastLoadedFlowId,
      });
    }
  };

  /**
   * Inicializa automáticamente cuando detecta que estamos en una ruta del flujo
   */
  const initialize = async (): Promise<void> => {
    console.log("🔵 [useJuntasGlobalSnapshotLoader] initialize() INICIADO");

    const isJuntasRoute = isJuntasFlowRoute();
    console.log(
      "🔵 [useJuntasGlobalSnapshotLoader] isJuntasFlowRoute() result:",
      isJuntasRoute
    );

    if (!isJuntasRoute) {
      console.warn("🟡 [useJuntasGlobalSnapshotLoader] No es una ruta de juntas, saliendo...");
      return;
    }

    const { societyId, flowId } = getRouteIds();
    console.log("🔵 [useJuntasGlobalSnapshotLoader] IDs obtenidos:", { societyId, flowId });

    if (!societyId || !flowId) {
      console.warn(
        "🟡 [useJuntasGlobalSnapshotLoader] No hay IDs válidos, omitiendo carga...",
        { societyId, flowId }
      );
      return;
    }

    console.log("🟢 [useJuntasGlobalSnapshotLoader] Llamando loadFromBackend()...", {
      societyId,
      flowId,
    });

    // Cargar desde el backend
    await loadFromBackend(societyId, flowId);

    console.log("🔵 [useJuntasGlobalSnapshotLoader] initialize() COMPLETADO");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 RESUMEN - Estado del Snapshot Loader:");
    console.log("  • Composable ejecutado: ✅");
    console.log("  • Ruta detectada: " + (isJuntasRoute ? "✅" : "❌"));
    console.log("  • IDs extraídos:", { societyId, flowId });
    console.log(
      "  • Snapshot en store: " + (snapshotStore.snapshot ? "✅ (existe)" : "❌ (no existe)")
    );
    if (snapshotStore.snapshot) {
      console.log("  • Snapshot flowId:", snapshotStore.currentFlowId);
      console.log("  • Snapshot societyId:", snapshotStore.currentSocietyId);
      console.log(
        "  • FETCH EJECUTADO: " +
          (snapshotStore.currentFlowId === flowId &&
          snapshotStore.currentSocietyId === societyId
            ? "❌ NO (ya existe en store)"
            : "✅ SÍ")
      );
    } else {
      console.log("  • FETCH EJECUTADO: ✅ SÍ (no hay snapshot)");
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
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
      console.log("🔵 [useJuntasGlobalSnapshotLoader] Watch detectó cambio en ruta:", {
        oldSocietyId,
        newSocietyId,
        oldFlowId,
        newFlowId,
        flowIdChanged: newFlowId !== oldFlowId,
      });
      // Solo recargar si cambió el flowId (no solo la sociedad)
      if (newFlowId !== oldFlowId && newSocietyId && newFlowId) {
        console.log(
          "🟢 [useJuntasGlobalSnapshotLoader] FlowId cambió, reseteando y recargando..."
        );
        resetLoader();
        await initialize();
      }
    },
    { immediate: false }
  );

  // Inicializar al montar
  onMounted(() => {
    console.log(
      "🔵 [useJuntasGlobalSnapshotLoader] onMounted() ejecutado, llamando initialize()..."
    );
    initialize();
  });

  console.log(
    "🔵 [useJuntasGlobalSnapshotLoader] Composable configurado, esperando onMounted..."
  );

  return {
    initialize,
    resetLoader,
  };
}
