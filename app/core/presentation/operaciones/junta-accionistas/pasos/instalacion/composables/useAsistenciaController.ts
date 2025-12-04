/**
 * Controller para Instalación de la Junta (Asistencia)
 * 
 * Gestiona el ciclo de vida del componente de instalación.
 * 
 * @architecture Controller Pattern
 * @layer Presentation
 */

import { onMounted, onActivated } from "vue";
import { storeToRefs } from "pinia";
import { useAsistenciaStore } from "../stores/asistencia.store";

/**
 * Opciones para el controller
 */
export interface UseAsistenciaControllerOptions {
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
}

/**
 * Controller para Instalación de la Junta
 */
export function useAsistenciaController(
  societyId: number | string,
  flowId: string,
  options: UseAsistenciaControllerOptions = {}
) {
  const { autoLoad = true, reloadOnActivated = false } = options;

  // ========================================
  // STORE
  // ========================================
  const store = useAsistenciaStore();
  const {
    asistencia,
    loading,
    error,
    asistentes,
    representantes,
    quorum,
    mesaDirectiva,
    hasQuorum,
    capitalPresente,
    porcentajeAsistencia,
    isComplete,
    isReadyToContinue,
  } = storeToRefs(store);

  // ========================================
  // METHODS
  // ========================================
  
  /**
   * Carga la asistencia
   */
  async function loadAsistencia() {
    const sid = typeof societyId === "string" ? parseInt(societyId, 10) : societyId;
    
    if (!sid || isNaN(sid)) {
      console.error("[AsistenciaController] Invalid societyId:", societyId);
      return;
    }

    await store.load(sid, flowId);
  }

  /**
   * Guarda la asistencia
   */
  async function saveAsistencia() {
    await store.save();
  }

  /**
   * Marca un accionista como asistente
   */
  function markAsistente(accionistaId: string, data: any) {
    store.markAsistente(accionistaId, data);
  }

  /**
   * Remueve un asistente
   */
  function removeAsistente(accionistaId: string) {
    store.removeAsistente(accionistaId);
  }

  /**
   * Actualiza la mesa directiva
   */
  function setMesaDirectiva(mesaDirectiva: any) {
    store.setMesaDirectiva(mesaDirectiva);
  }

  // ========================================
  // LIFECYCLE
  // ========================================
  
  if (autoLoad) {
    onMounted(async () => {
      console.log("[AsistenciaController] onMounted - Loading asistencia...");
      await loadAsistencia();
    });
  }

  if (reloadOnActivated) {
    onActivated(async () => {
      console.log("[AsistenciaController] onActivated - Reloading asistencia...");
      await loadAsistencia();
    });
  }

  // ========================================
  // RETURN
  // ========================================
  
  return {
    // State
    asistencia,
    loading,
    error,
    asistentes,
    representantes,
    quorum,
    mesaDirectiva,
    hasQuorum,
    capitalPresente,
    porcentajeAsistencia,
    isComplete,
    isReadyToContinue,

    // Methods
    loadAsistencia,
    saveAsistencia,
    markAsistente,
    removeAsistente,
    setMesaDirectiva,
  };
}

