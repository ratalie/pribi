/**
 * Composable global para cargar automáticamente los puntos de agenda
 * en cualquier página del flujo de juntas
 * 
 * Este composable se debe llamar desde el layout del flujo para asegurar
 * que los puntos de agenda siempre estén cargados, incluso si no estás
 * en la página de selección de agenda.
 * 
 * Responsabilidades:
 * - Detectar si estamos en una ruta del flujo de juntas
 * - Cargar puntos de agenda del backend automáticamente
 * - Sincronizar con el store local
 * - Evitar cargas duplicadas
 */

import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { AgendaItemsMapper } from "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper";
import { useAgendaItemsStore } from "~/core/presentation/juntas/stores/agenda-items.store";
import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import { useSeleccionAgendaSetup } from "./useSeleccionAgendaSetup";

// Flag para evitar cargas duplicadas
let isLoadingGlobal = false;
let lastLoadedFlowId: string | null = null;

export function useJuntasGlobalAgendaLoader() {
  const route = useRoute();
  const juntasFlowStore = useJuntasFlowStore();
  const agendaItemsStore = useAgendaItemsStore();
  const { agendaItems } = storeToRefs(agendaItemsStore);

  // Obtener composables compartidos (singleton)
  const { puntosAgenda, juntaObligatoria } = useSeleccionAgendaSetup();

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
   * Inicializa desde el store local (rápido)
   */
  const initializeFromStore = () => {
    puntosAgenda.initializeFromStore();
    juntaObligatoria.initializeFromPuntos();
  };

  /**
   * Carga puntos de agenda desde el backend
   */
  const loadFromBackend = async (societyId: number, flowId: number): Promise<void> => {
    const flowIdString = String(flowId);

    // Evitar cargas duplicadas si ya se cargó para este flowId
    if (isLoadingGlobal && lastLoadedFlowId === flowIdString) {
      console.debug("[useJuntasGlobalAgendaLoader] Ya se está cargando para este flowId, omitiendo...");
      return;
    }

    // Verificar si el store ya tiene datos cargados para este flowId
    if (agendaItems.value && agendaItemsStore.currentFlowId === flowId) {
      console.debug("[useJuntasGlobalAgendaLoader] Store ya tiene datos para este flowId, sincronizando...");
      const frontendIds = AgendaItemsMapper.dtoToFrontendIds(agendaItems.value);
      puntosAgenda.initializeFromExternal(frontendIds);
      juntaObligatoria.initializeFromPuntos();
      lastLoadedFlowId = flowIdString;
      return;
    }

    // Si ya se intentó cargar para este flowId, no recargar
    if (lastLoadedFlowId === flowIdString) {
      console.debug("[useJuntasGlobalAgendaLoader] Ya se intentó cargar para este flowId, usando store local");
      initializeFromStore();
      return;
    }

    try {
      isLoadingGlobal = true;
      lastLoadedFlowId = flowIdString;

      console.debug("[useJuntasGlobalAgendaLoader] Cargando puntos de agenda desde backend...", {
        societyId,
        flowId,
      });

      // Cargar desde el backend
      await agendaItemsStore.loadAgendaItems(societyId, flowId);

      // Si hay datos cargados, convertir a IDs del frontend y actualizar
      if (agendaItems.value) {
        const frontendIds = AgendaItemsMapper.dtoToFrontendIds(agendaItems.value);
        puntosAgenda.initializeFromExternal(frontendIds);
        juntaObligatoria.initializeFromPuntos();

        console.debug("[useJuntasGlobalAgendaLoader] Puntos de agenda cargados:", frontendIds.length);
      } else {
        // Si no hay datos en el backend, inicializar desde store local
        console.debug("[useJuntasGlobalAgendaLoader] No hay datos en backend, usando store local");
        initializeFromStore();
      }
    } catch (error) {
      console.error("[useJuntasGlobalAgendaLoader] Error al cargar agenda items:", error);

      // En caso de error, inicializar desde store local como fallback
      initializeFromStore();
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
      // Si no hay IDs válidos, solo inicializar desde store local
      initializeFromStore();
      return;
    }

    // Primero cargar desde el store local (rápido)
    initializeFromStore();

    // Luego intentar cargar desde el backend
    await loadFromBackend(societyId, flowId);
  };

  /**
   * Reinicia el estado de carga (útil cuando cambias de flowId)
   */
  const resetLoader = () => {
    lastLoadedFlowId = null;
    isLoadingGlobal = false;
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

