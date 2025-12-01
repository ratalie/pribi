/**
 * Utilidades para construir rutas de Juntas de Accionistas
 * 
 * Este helper permite construir rutas con societyId y flowId,
 * manteniendo compatibilidad con flujos nuevos (sin IDs) y existentes (con IDs).
 * 
 * Estructura de rutas:
 * - Con IDs: /operaciones/sociedades/:societyId/junta-accionistas/:flowId/seleccion-agenda
 * - Sin IDs: /operaciones/sociedades/:societyId/junta-accionistas/seleccion-agenda
 */

import { JuntaRoutes } from "~/config/routes/junta-accionistas.routes";

/**
 * Construye una ruta de junta con societyId y flowId si están disponibles
 * 
 * @param route - Ruta base del enum JuntaRoutes (sin IDs)
 * @param societyId - ID de la sociedad (opcional)
 * @param flowId - ID del flujo/junta (opcional)
 * @returns Ruta completa con IDs si están disponibles, ruta base si no
 * 
 * @example
 * buildJuntaRoute(JuntaRoutes.SELECCION_AGENDA, "30", "7")
 * // "/operaciones/sociedades/30/junta-accionistas/7/seleccion-agenda"
 * 
 * buildJuntaRoute(JuntaRoutes.SELECCION_AGENDA, "30")
 * // "/operaciones/sociedades/30/junta-accionistas/seleccion-agenda" (solo societyId)
 * 
 * buildJuntaRoute(JuntaRoutes.SELECCION_AGENDA)
 * // "/operaciones/sociedades/:societyId/junta-accionistas/seleccion-agenda" (ruta base con placeholder)
 */
export function buildJuntaRoute(
  route: JuntaRoutes,
  societyId?: string | number | null,
  flowId?: string | number | null
): string {
  // Si no hay IDs, devolver la ruta base
  if (!societyId && !flowId) {
    return route;
  }

  // Convertir IDs a string
  const societyIdStr = societyId ? String(societyId) : null;
  const flowIdStr = flowId ? String(flowId) : null;

  // Reemplazar el placeholder :societyId con el ID real
  // La ruta base tiene formato: /operaciones/sociedades/:societyId/junta-accionistas/...
  
  // Si solo hay societyId
  if (societyIdStr && !flowIdStr) {
    return route.replace(
      /\/operaciones\/sociedades\/:societyId\/junta-accionistas\//,
      `/operaciones/sociedades/${societyIdStr}/junta-accionistas/`
    );
  }

  // Si hay ambos IDs (caso completo)
  if (societyIdStr && flowIdStr) {
    return route.replace(
      /\/operaciones\/sociedades\/:societyId\/junta-accionistas\//,
      `/operaciones/sociedades/${societyIdStr}/junta-accionistas/${flowIdStr}/`
    );
  }

  // Si solo hay flowId (caso raro, pero lo soportamos - usar placeholder para societyId)
  if (!societyIdStr && flowIdStr) {
    return route.replace(
      /\/operaciones\/sociedades\/:societyId\/junta-accionistas\//,
      `/operaciones/sociedades/:societyId/junta-accionistas/${flowIdStr}/`
    );
  }

  return route;
}

/**
 * Construye múltiples rutas de junta con los mismos IDs
 * 
 * @param routes - Array de rutas base del enum JuntaRoutes
 * @param societyId - ID de la sociedad (opcional)
 * @param flowId - ID del flujo/junta (opcional)
 * @returns Array de rutas completas con IDs si están disponibles
 * 
 * @example
 * buildJuntaRoutes([JuntaRoutes.SELECCION_AGENDA, JuntaRoutes.DETALLES], "30", "7")
 * // ["/operaciones/sociedades/30/junta-accionistas/7/seleccion-agenda", "/operaciones/sociedades/30/junta-accionistas/7/detalles"]
 */
export function buildJuntaRoutes(
  routes: JuntaRoutes[],
  societyId?: string | number | null,
  flowId?: string | number | null
): string[] {
  return routes.map((route) => buildJuntaRoute(route, societyId, flowId));
}

