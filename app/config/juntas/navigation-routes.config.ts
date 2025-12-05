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
    "utilidades-montos": `${basePath}/aplicacion-resultados/utilidades-montos`,
    votacion: `${basePath}/aplicacion-resultados/votacion`,
    resumen: `${basePath}/aplicacion-resultados/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "pronunciamiento-gestion"
 */
export function getPronunciamientoGestionRoutes(basePath: string): Record<string, string> {
  return {
    "pronunciamiento-gestion": `${basePath}/pronunciamiento-gestion`,
    pronunciamiento: `${basePath}/pronunciamiento-gestion/pronunciamiento`,
    votacion: `${basePath}/pronunciamiento-gestion/votacion`,
    resumen: `${basePath}/pronunciamiento-gestion/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "delegacion-auditores"
 */
export function getDelegacionAuditoresRoutes(basePath: string): Record<string, string> {
  return {
    "nombramiento-auditores": `${basePath}/nombramiento-auditores`,
    nombramiento: `${basePath}/nombramiento-auditores/nombramiento`,
    votacion: `${basePath}/nombramiento-auditores/votacion`,
    resumen: `${basePath}/nombramiento-auditores/resumen`,
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
    case "pronunciamiento-gestion":
      return getPronunciamientoGestionRoutes(basePath);
    case "delegacion-auditores":
      return getDelegacionAuditoresRoutes(basePath);
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
    "utilidades-montos": `${basePath}/aplicacion-resultados/utilidades-montos`,
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

  // Si el anchorId es una sub-sección de utilidades-montos, retornar la ruta padre
  const utilidadesMontosAnchors = [
    "valores-preliminares",
    "calculo-utilidad-antes-reserva",
    "calculo-reserva-legal",
    "valores-utilidad-distribuible",
  ];
  if (utilidadesMontosAnchors.includes(anchorId)) {
    return {
      parentId: "utilidades-montos",
      parentRoute: `${basePath}/aplicacion-resultados/utilidades-montos`,
    };
  }

  return null;
}
