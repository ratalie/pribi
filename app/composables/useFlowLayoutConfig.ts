/**
 * Composable para cargar la configuración de layout basada en la ruta actual
 *
 * Este composable determina qué FlowLayoutConfig usar basándose en la ruta
 * y proporciona la configuración al layout universal.
 */

import { computed } from "vue";
import { useRoute } from "vue-router";
import juntasLayoutConfig from "~/config/flows/juntas.layout";
import sucursalesLayoutConfig from "~/config/flows/sucursales.layout";
import type { FlowLayoutConfig } from "~/types/flow-layout";

/**
 * Mapeo de rutas a configuraciones de layout
 */
const LAYOUT_CONFIG_MAP: Record<string, FlowLayoutConfig> = {
  "/operaciones/junta-accionistas": juntasLayoutConfig,
  "/registro-societario/sucursales": sucursalesLayoutConfig,
};

/**
 * Hook para obtener la configuración del layout actual
 *
 * @returns FlowLayoutConfig correspondiente a la ruta actual
 */
export function useFlowLayoutConfig() {
  const route = useRoute();

  /**
   * Configuración del layout basada en la ruta
   */
  const layoutConfig = computed<FlowLayoutConfig | null>(() => {
    const path = route.path;

    // Buscar la configuración que coincida con el prefijo de la ruta
    for (const [prefix, config] of Object.entries(LAYOUT_CONFIG_MAP)) {
      if (path.startsWith(prefix)) {
        return config;
      }
    }

    // Si no hay match, retornar null
    console.warn("[useFlowLayoutConfig] No se encontró configuración para la ruta:", path);
    return null;
  });

  /**
   * ID del flow actual
   */
  const flowId = computed(() => layoutConfig.value?.flowConfig?.id || null);

  /**
   * Nombre del flow actual
   */
  const flowName = computed(() => layoutConfig.value?.name || "Sin configuración");

  /**
   * Tipo del flow actual
   */
  const flowType = computed(() => layoutConfig.value?.type || "custom");

  return {
    layoutConfig,
    flowId,
    flowName,
    flowType,
  };
}
