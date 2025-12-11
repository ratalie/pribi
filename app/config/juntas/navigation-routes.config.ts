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
 * Mapeo de secciones a rutas para "remocion-gerente"
 */
export function getRemocionGerenteRoutes(basePath: string): Record<string, string> {
  return {
    "remocion-gerente": `${basePath}/remocion-gerente`,
    remocion: `${basePath}/remocion-gerente/remocion`,
    votacion: `${basePath}/remocion-gerente/votacion`,
    resumen: `${basePath}/remocion-gerente/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "remocion-apoderados"
 */
export function getRemocionApoderadosRoutes(basePath: string): Record<string, string> {
  return {
    "remocion-apoderados": `${basePath}/remocion-apoderados`,
    remocion: `${basePath}/remocion-apoderados/remocion`,
    "otorgamiento-facultades": `${basePath}/remocion-apoderados/remocion`,
    votacion: `${basePath}/remocion-apoderados/votacion`,
    resumen: `${basePath}/remocion-apoderados/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "remocion-directores"
 */
export function getRemocionDirectoresRoutes(basePath: string): Record<string, string> {
  return {
    "remocion-directores": `${basePath}/remocion-directores`,
    remocion: `${basePath}/remocion-directores/remocion`,
    votacion: `${basePath}/remocion-directores/votacion`,
    resumen: `${basePath}/remocion-directores/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "nombramiento-gerente"
 */
export function getNombramientoGerenteRoutes(basePath: string): Record<string, string> {
  return {
    "nombramiento-gerente": `${basePath}/nombramiento-gerente`,
    nombramiento: `${basePath}/nombramiento-gerente/nombramiento`,
    otorgamiento: `${basePath}/nombramiento-gerente/otorgamiento`,
    votacion: `${basePath}/nombramiento-gerente/votacion`,
    resumen: `${basePath}/nombramiento-gerente/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "nombramiento-apoderados"
 */
export function getNombramientoApoderadosRoutes(basePath: string): Record<string, string> {
  return {
    "nombramiento-apoderados": `${basePath}/nombramiento-apoderados`,
    nombramiento: `${basePath}/nombramiento-apoderados/nombramiento`,
    "otorgamiento-poderes": `${basePath}/nombramiento-apoderados/otorgamiento-poderes`,
    votacion: `${basePath}/nombramiento-apoderados/votacion`,
    resumen: `${basePath}/nombramiento-apoderados/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "nombramiento-directores"
 */
export function getNombramientoDirectoresRoutes(basePath: string): Record<string, string> {
  return {
    "nombramiento-directores": `${basePath}/nombramiento-directores`,
    nombramiento: `${basePath}/nombramiento-directores/nombramiento`,
    votacion: `${basePath}/nombramiento-directores/votacion`,
    presidente: `${basePath}/nombramiento-directores/nombramiento`,
    resumen: `${basePath}/nombramiento-directores/resumen`,
  };
}

/**
 * Mapeo de secciones a rutas para "nombramiento-directorio"
 */
export function getNombramientoDirectorioRoutes(basePath: string): Record<string, string> {
  return {
    "nombramiento-directorio": `${basePath}/nombramiento-directorio`,
    cantidad: `${basePath}/nombramiento-directorio/cantidad`,
    "votacion-configuracion": `${basePath}/nombramiento-directorio/votacion`,
    nombramiento: `${basePath}/nombramiento-directorio/nombramiento`,
    votacion: `${basePath}/nombramiento-directorio/votacion`,
    presidente: `${basePath}/nombramiento-directorio/nombramiento`,
    resumen: `${basePath}/nombramiento-directorio/resumen`,
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
    case "remocion-gerente":
      return getRemocionGerenteRoutes(basePath);
    case "remocion-apoderados":
      return getRemocionApoderadosRoutes(basePath);
    case "remocion-directores":
      return getRemocionDirectoresRoutes(basePath);
    case "nombramiento-gerente":
      return getNombramientoGerenteRoutes(basePath);
    case "nombramiento-apoderados":
      return getNombramientoApoderadosRoutes(basePath);
    case "nombramiento-directores":
      return getNombramientoDirectoresRoutes(basePath);
    case "nombramiento-nuevo-directorio":
      return getNombramientoDirectorioRoutes(basePath);
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
