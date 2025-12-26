/**
 * Composable para detectar si estamos en la página de resumen general
 * 
 * Distingue entre:
 * - Resumen general: /operaciones/junta-accionistas/resumen
 * - Resumen de sub-step: /operaciones/junta-accionistas/aporte-dinerario/resumen
 */

import { computed } from "vue";
import { isResumenGeneralPage } from "~/utils/juntas/route-detection.utils";

/**
 * Detecta si la ruta actual es el resumen general
 */
export function useJuntasResumenDetection() {
  const route = useRoute();

  const isResumenPage = computed(() => {
    const path = route.path;
    const result = isResumenGeneralPage(path);
    
    console.log("🟦 [useJuntasResumenDetection] isResumenPage:", {
      path,
      isResumenGeneral: result,
    });
    
    return result;
  });

  return {
    isResumenPage,
  };
}

