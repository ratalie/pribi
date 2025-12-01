/**
 * Utilidades para construir rutas de Juntas de Accionistas
 * 
 * Este helper permite construir rutas con o sin ID de junta,
 * manteniendo compatibilidad con flujos nuevos (sin ID) y existentes (con ID).
 */

import { JuntaRoutes } from "~/config/routes/junta-accionistas.routes";

/**
 * Construye una ruta de junta con el ID si está disponible
 * 
 * @param route - Ruta base del enum JuntaRoutes (sin ID)
 * @param juntaId - ID de la junta (opcional)
 * @returns Ruta completa con ID si está disponible, ruta base si no
 * 
 * @example
 * buildJuntaRoute(JuntaRoutes.SELECCION_AGENDA, "123")
 * // "/operaciones/junta-accionistas/123/seleccion-agenda"
 * 
 * buildJuntaRoute(JuntaRoutes.SELECCION_AGENDA)
 * // "/operaciones/junta-accionistas/seleccion-agenda"
 */
export function buildJuntaRoute(route: JuntaRoutes, juntaId?: string | null): string {
  // Si no hay juntaId, devolver la ruta base
  if (!juntaId) {
    return route;
  }

  // Reemplazar /operaciones/junta-accionistas/ por /operaciones/junta-accionistas/{juntaId}/
  return route.replace(
    /^\/operaciones\/junta-accionistas\//,
    `/operaciones/junta-accionistas/${juntaId}/`
  );
}

/**
 * Construye múltiples rutas de junta con el mismo ID
 * 
 * @param routes - Array de rutas base del enum JuntaRoutes
 * @param juntaId - ID de la junta (opcional)
 * @returns Array de rutas completas con ID si está disponible
 * 
 * @example
 * buildJuntaRoutes([JuntaRoutes.SELECCION_AGENDA, JuntaRoutes.DETALLES], "123")
 * // ["/operaciones/junta-accionistas/123/seleccion-agenda", "/operaciones/junta-accionistas/123/detalles"]
 */
export function buildJuntaRoutes(
  routes: JuntaRoutes[],
  juntaId?: string | null
): string[] {
  return routes.map((route) => buildJuntaRoute(route, juntaId));
}

