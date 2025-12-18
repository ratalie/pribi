/**
 * Composable reutilizable para páginas de votación
 *
 * Extrae la lógica común entre diferentes páginas de votación:
 * - Extracción de valores computed del controller
 * - Manejo de metodoVotacion (unanimidad/mayoría)
 * - Handlers para cambiar tipo y votos
 * - Configuración del botón "Siguiente"
 */

import { computed, type ComputedRef } from "vue";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
import { useJuntasFlowNext } from "./useJuntasFlowNext";

interface VotacionController {
  isLoading: ComputedRef<boolean> | boolean;
  error: ComputedRef<string | null> | string | null;
  votantes: ComputedRef<any[]> | any[];
  pregunta?: ComputedRef<string> | string;
  textoVotacion?: ComputedRef<string> | string;
  mensajeAprobacion?: ComputedRef<string> | string;
  cambiarTipoAprobacion: (tipo: "unanimidad" | "mayoria") => void;
  setVoto: (accionistaId: string, valor: VoteValue) => void;
  guardarVotacion: () => Promise<void>;
}

/**
 * Helper: Extraer valor de computed o valor directo
 */
function extractValue<T>(value: ComputedRef<T> | T, defaultValue: T): T {
  if (!value) return defaultValue;
  if (typeof value === "object" && "value" in value) {
    return (value as ComputedRef<T>).value ?? defaultValue;
  }
  return value as T;
}

/**
 * Helper: Extraer array de computed o array directo
 */
function extractArray<T>(value: ComputedRef<T[]> | T[]): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object" && "value" in value) {
    const computedValue = (value as ComputedRef<T[]>).value;
    return Array.isArray(computedValue) ? computedValue : [];
  }
  return [];
}

/**
 * Composable para páginas de votación
 *
 * @param controller - Controller específico de la votación (remoción, nombramiento, etc.)
 * @param options - Opciones de configuración
 */
export function useVotacionPage(
  controller: VotacionController,
  options?: {
    /** Si se usa textoVotacion en lugar de pregunta */
    useTextoVotacion?: boolean;
  }
) {
  const votacionStore = useVotacionStore();

  // ✅ Obtener props del controller
  const isLoading = computed(() => extractValue(controller.isLoading, false));
  const error = computed(() => extractValue(controller.error, null));

  // ✅ Extraer valores de los computed
  const votantes = computed(() => extractArray(controller.votantes));

  // ✅ Extraer pregunta o textoVotacion según la opción
  const pregunta = computed(() => {
    if (options?.useTextoVotacion) {
      // Si usa textoVotacion, retornar vacío (se retornará textoVotacion por separado)
      return "";
    }
    if (controller.pregunta) {
      return extractValue(controller.pregunta, "");
    }
    return "";
  });

  // ✅ Extraer textoVotacion (solo si useTextoVotacion es true)
  const textoVotacion = computed(() => {
    if (options?.useTextoVotacion && controller.textoVotacion) {
      return extractValue(controller.textoVotacion, "");
    }
    return "";
  });

  // ✅ Extraer mensajeAprobacion
  const mensajeAprobacion = computed(() => {
    if (controller.mensajeAprobacion) {
      return extractValue(controller.mensajeAprobacion, "");
    }
    return "";
  });

  // ✅ Método de votación (unanimidad/mayoría) basado en tipoAprobacion del store
  const metodoVotacion = computed({
    get: () => {
      if (!votacionStore.hasVotacion) return "unanimidad"; // Por defecto
      return votacionStore.esUnanimidad ? "unanimidad" : "mayoria";
    },
    set: (value: string) => {
      // Solo actualizar estado local, NO guardar
      controller.cambiarTipoAprobacion(value as "unanimidad" | "mayoria");
    },
  });

  // ✅ Handler para cambiar tipo de votación
  function handleCambiarTipo(tipo: "unanimidad" | "mayoria") {
    // Solo actualizar estado local, NO guardar
    controller.cambiarTipoAprobacion(tipo);
  }

  // ✅ Handler para cambiar voto de un accionista
  function handleCambiarVoto(
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  ) {
    // Convertir string literal a enum VoteValue
    const voteValue =
      valor === "A_FAVOR"
        ? VoteValue.A_FAVOR
        : valor === "EN_CONTRA"
        ? VoteValue.EN_CONTRA
        : VoteValue.ABSTENCION;

    controller.setVoto(accionistaId, voteValue as VoteValue);
  }

  // ✅ Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    await controller.guardarVotacion();
  });

  return {
    // Estado
    isLoading,
    error,
    votantes,
    pregunta,
    textoVotacion,
    mensajeAprobacion,
    metodoVotacion,

    // Handlers
    handleCambiarTipo,
    handleCambiarVoto,
  };
}
