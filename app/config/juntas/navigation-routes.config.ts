/**
 * Configuración de rutas de navegación para secciones
 * 
 * Mapea IDs de secciones a sus rutas correspondientes
 */

// import { buildBasePath } from "~/utils/juntas/route-detection.utils"; // No usado actualmente

/**
 * Mapeo de secciones a rutas para "aporte-dinerarios"
 */
export function getAporteDinerarioRoutes(basePath: string): Record<string, string> {
  return {
    "aporte-dinerario": `${basePath}/aporte-dinerario`,
    "seleccion-aportantes": `${basePath}/aporte-dinerario/aportantes`,
    "aportes-dinerarios": `${basePath}/aporte-dinerario/aportes`,
    "test-anclas": `${basePath}/aporte-dinerario/test-anclas`,
    "test-rutas": `${basePath}/aporte-dinerario/test-rutas`,
    "ruta-1": `${basePath}/aporte-dinerario/test-rutas/ruta-1`,
    "ruta-2": `${basePath}/aporte-dinerario/test-rutas/ruta-2`,
    "ruta-3": `${basePath}/aporte-dinerario/test-rutas/ruta-3`,
    votacion: `${basePath}/aporte-dinerario/votacion`,
    resumen: `${basePath}/aporte-dinerario/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "aplicacion-resultados"
 */
export function getAplicacionResultadosRoutes(basePath: string): Record<string, string> {
  return {
    "aplicacion-resultados": `${basePath}/aplicacion-resultados`,
    "utilidades-montos": `${basePath}/aplicacion-resultados`,
    votacion: `${basePath}/aplicacion-resultados/votacion`,
    resumen: `${basePath}/aplicacion-resultados/resumen`,
  };
}

/**
 * Obtiene el mapeo de rutas para un sub-step
 */
export function getSectionRoutesForSubStep(
  subStepId: string,
  basePath: string
): Record<string, string> | null {
  switch (subStepId) {
    case "aporte-dinerarios":
      return getAporteDinerarioRoutes(basePath);
    case "aplicacion-resultados":
      return getAplicacionResultadosRoutes(basePath);
    default:
      return null;
  }
}

/**
 * Mapeo de secciones padre para anclas
 */
export function getParentSectionForAnchor(
  anchorId: string,
  subStepId: string,
  basePath: string,
  sections: Array<{ id: string; subSections?: Array<{ id: string }> }>
): { parentId: string; parentRoute: string } | null {
  const parentRouteMap: Record<string, string> = {
    "test-anclas": `${basePath}/aporte-dinerario/test-anclas`,
    "utilidades-montos": `${basePath}/aplicacion-resultados`,
  };

  for (const section of sections) {
    if (section.subSections) {
      const hasAnchor = section.subSections.some((sub) => sub.id === anchorId);
      if (hasAnchor) {
        const parentRoute = parentRouteMap[section.id] || `${basePath}/${subStepId}`;
        return { parentId: section.id, parentRoute };
      }
    }
  }

  return null;
}

