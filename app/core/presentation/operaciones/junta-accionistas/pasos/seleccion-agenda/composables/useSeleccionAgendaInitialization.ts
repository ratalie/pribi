/**
 * Composable para inicializar y cargar datos de selección de agenda
 * 
 * Responsabilidades:
 * - Cargar datos del store local (si existen)
 * - Cargar datos del backend (si hay societyId y flowId)
 * - Convertir datos del backend a formato frontend
 * - Inicializar estado de junta obligatoria
 * - Manejar errores de carga
 */

import { storeToRefs } from "pinia";
import { AgendaItemsMapper } from "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper";
import { useAgendaItemsStore } from "~/core/presentation/juntas/stores/agenda-items.store";
import { useJuntasRouteParams } from "./useJuntasRouteParams";
import { useSeleccionAgendaSetup } from "./useSeleccionAgendaSetup";

export function useSeleccionAgendaInitialization() {
  // Obtener IDs de la ruta
  const { societyId, flowIdNumber } = useJuntasRouteParams();

  // Stores
  const agendaItemsStore = useAgendaItemsStore();
  const { agendaItems } = storeToRefs(agendaItemsStore);

  // Obtener composables compartidos
  const { puntosAgenda, juntaObligatoria } = useSeleccionAgendaSetup();

  /**
   * Inicializa la vista con datos del store local
   */
  const initializeFromStore = () => {
    puntosAgenda.initializeFromStore();
  };

  /**
   * Carga datos del backend y actualiza el estado
   */
  const loadFromBackend = async (): Promise<void> => {
    if (!societyId.value || !flowIdNumber.value) {
      // Si no hay IDs, solo inicializar desde store local
      initializeFromStore();
      juntaObligatoria.initializeFromPuntos();
      return;
    }

    try {
      // Cargar desde el backend
      await agendaItemsStore.loadAgendaItems(societyId.value, flowIdNumber.value);

      // Si hay datos cargados, convertir a IDs del frontend y actualizar
      if (agendaItems.value) {
        const frontendIds = AgendaItemsMapper.dtoToFrontendIds(agendaItems.value);
        puntosAgenda.initializeFromExternal(frontendIds);

        // Sincronizar estado de junta obligatoria
        juntaObligatoria.initializeFromPuntos();
      } else {
        // Si no hay datos en el backend, inicializar desde store local
        initializeFromStore();
        juntaObligatoria.initializeFromPuntos();
      }
    } catch (error) {
      console.error("[useSeleccionAgendaInitialization] Error al cargar agenda items:", error);
      
      // En caso de error, inicializar desde store local como fallback
      initializeFromStore();
      juntaObligatoria.initializeFromPuntos();
    }
  };

  /**
   * Inicializa completamente la vista
   * Se ejecuta al montar el componente
   */
  const initialize = async (): Promise<void> => {
    // Primero cargar desde el store local (rápido)
    initializeFromStore();

    // Luego intentar cargar desde el backend (si hay IDs)
    await loadFromBackend();
  };

  return {
    initialize,
    initializeFromStore,
    loadFromBackend,
  };
}

