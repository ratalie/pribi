/**
 * Controller para Detalles de la Junta
 * 
 * Gestiona el ciclo de vida del componente de detalles.
 * 
 * @architecture Controller Pattern
 * @layer Presentation
 */

import { onMounted, onActivated, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMeetingDetailsStore } from "../stores/meeting-details.store";
import { TipoJunta } from "~/core/hexag/juntas/domain/enums/tipo-junta.enum";

/**
 * Opciones para el controller
 */
export interface UseMeetingDetailsControllerOptions {
  /**
   * Cargar automáticamente al montar el componente
   * @default true
   */
  autoLoad?: boolean;

  /**
   * Recargar al activar el componente (keep-alive)
   * @default false
   */
  reloadOnActivated?: boolean;

  /**
   * Inicializar detalles si no existen
   * @default true
   */
  ensureInitialized?: boolean;
}

/**
 * Controller para Detalles de la Junta
 */
export function useMeetingDetailsController(
  societyId: number | string,
  flowId: string,
  options: UseMeetingDetailsControllerOptions = {}
) {
  const { 
    autoLoad = true, 
    reloadOnActivated = false,
    ensureInitialized = true,
  } = options;

  // ========================================
  // STORE
  // ========================================
  const store = useMeetingDetailsStore();
  const {
    details,
    loading,
    error,
    tipoJunta,
    isUniversal,
    isGeneral,
    convocatoria,
    lugar,
    presidencia,
    isComplete,
    isReadyToContinue,
  } = storeToRefs(store);

  // ========================================
  // METHODS
  // ========================================
  
  /**
   * Carga los detalles
   */
  async function loadDetails() {
    const sid = typeof societyId === "string" ? parseInt(societyId, 10) : societyId;
    
    if (!sid || isNaN(sid)) {
      console.error("[MeetingDetailsController] Invalid societyId:", societyId);
      return;
    }

    await store.load(sid, flowId);

    // Inicializar si no existen
    if (ensureInitialized) {
      store.ensureInitialized();
    }
  }

  /**
   * Guarda los detalles
   */
  async function saveDetails() {
    await store.save();
  }

  /**
   * Actualiza el tipo de junta
   */
  function setTipoJunta(tipo: any) {
    store.setTipoJunta(tipo);
  }

  /**
   * Actualiza la convocatoria
   */
  function setConvocatoria(convocatoria: any) {
    store.setConvocatoria(convocatoria);
  }

  /**
   * Actualiza el lugar
   */
  function setLugar(lugar: any) {
    store.setLugar(lugar);
  }

  /**
   * Actualiza la presidencia
   */
  function setPresidencia(presidencia: any) {
    store.setPresidencia(presidencia);
  }

  // ========================================
  // LIFECYCLE
  // ========================================
  
  if (autoLoad) {
    onMounted(async () => {
      console.log("[MeetingDetailsController] onMounted - Loading details...");
      await loadDetails();
    });
  }

  if (reloadOnActivated) {
    onActivated(async () => {
      console.log("[MeetingDetailsController] onActivated - Reloading details...");
      await loadDetails();
    });
  }

  // ========================================
  // WATCHERS
  // ========================================

  // Cuando cambia el tipo de junta, ajustar validaciones
  watch(tipoJunta, (newType, oldType) => {
    if (newType !== oldType) {
      console.log(`[MeetingDetailsController] Tipo junta changed: ${oldType} → ${newType}`);
      
      // Si cambia a Universal, no se requiere convocatoria
      if (newType === TipoJunta.UNIVERSAL) {
        console.log("[MeetingDetailsController] Universal: convocatoria no requerida");
      }
    }
  });

  // ========================================
  // RETURN
  // ========================================
  
  return {
    // State
    details,
    loading,
    error,
    tipoJunta,
    isUniversal,
    isGeneral,
    convocatoria,
    lugar,
    presidencia,
    isComplete,
    isReadyToContinue,

    // Methods
    loadDetails,
    saveDetails,
    setTipoJunta,
    setConvocatoria,
    setLugar,
    setPresidencia,
  };
}

