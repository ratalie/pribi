/**
 * Composable para extraer IDs de la ruta de juntas
 *
 * Reutilizable en todas las páginas del flujo de juntas.
 * Maneja diferentes formatos de parámetros (string, array, etc.)
 */

export function useJuntasRouteParams() {
  const route = useRoute();

  /**
   * Extrae el societyId de la ruta
   * Retorna null si no es válido
   */
  const societyId = computed<number | null>(() => {
    const param = route.params.societyId;

    if (typeof param === "string") {
      const parsed = parseInt(param, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }

    if (Array.isArray(param) && param[0]) {
      const parsed = parseInt(param[0] as string, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
  });

  /**
   * Extrae el flowId de la ruta como string
   * Retorna null si no es válido
   */
  const flowId = computed<string | null>(() => {
    const param = route.params.flowId;

    if (typeof param === "string") {
      return param;
    }

    if (Array.isArray(param) && param[0]) {
      return param[0] as string;
    }

    return null;
  });

  /**
   * Extrae el flowId de la ruta como number
   * Retorna null si no es válido
   */
  const flowIdNumber = computed<number | null>(() => {
    const flowIdValue = flowId.value;
    if (!flowIdValue) return null;

    const parsed = parseInt(flowIdValue, 10);
    return Number.isNaN(parsed) ? null : parsed;
  });

  /**
   * Valida que ambos IDs estén presentes
   */
  const hasValidIds = computed(() => {
    return societyId.value !== null && flowId.value !== null;
  });

  /**
   * Valida y retorna los IDs, o lanza un error
   */
  const requireIds = () => {
    if (!societyId.value || !flowId.value) {
      throw new Error(
        "No se pudo identificar la sociedad o la junta. Por favor, recarga la página."
      );
    }
    return {
      societyId: societyId.value,
      flowId: flowId.value,
      flowIdNumber: flowIdNumber.value!,
    };
  };

  return {
    societyId,
    flowId,
    flowIdNumber,
    hasValidIds,
    requireIds,
  };
}


