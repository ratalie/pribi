/**
 * Utilidades para detección de rutas en el flujo de Juntas
 */

import { SUB_STEP_SLUGS } from "~/config/juntas/sub-steps.constants";

/**
 * Patrón regex para detectar rutas de resumen general
 * Formato: /operaciones/junta-accionistas[/{id}]/resumen
 */
const RESUMEN_GENERAL_PATTERN = /^\/operaciones\/junta-accionistas(\/[^/]+)?\/resumen$/;

/**
 * Detecta si una ruta es el resumen general
 * 
 * @param path - Ruta a verificar
 * @returns true si es resumen general, false si es resumen de sub-step
 * 
 * @example
 * isResumenGeneralPage("/operaciones/junta-accionistas/resumen") // true
 * isResumenGeneralPage("/operaciones/junta-accionistas/aporte-dinerario/resumen") // false
 */
export function isResumenGeneralPage(path: string): boolean {
  // Verificar si la ruta termina en /resumen
  if (!path.endsWith("/resumen")) {
    return false;
  }

  // Verificar si coincide con el patrón de resumen general (sin sub-step)
  const directMatch = path === "/operaciones/junta-accionistas/resumen";
  if (directMatch) {
    return true;
  }

  // Extraer el segmento antes de /resumen
  const match = path.match(/\/operaciones\/junta-accionistas\/([^/]+)\/resumen$/);
  if (!match) {
    return false;
  }

  const segmentBeforeResumen = match[1];

  // Si el segmento es un sub-step conocido, NO es resumen general
  if (SUB_STEP_SLUGS.includes(segmentBeforeResumen as any)) {
    return false;
  }

  // Si el segmento parece un UUID o ID, entonces SÍ es resumen general
  // (ej: /operaciones/junta-accionistas/123e4567-e89b-12d3-a456-426614174000/resumen)
  return true;
}

/**
 * Extrae el ID de junta de una ruta
 * 
 * @param path - Ruta a analizar
 * @returns ID de junta o null si no se encuentra
 * 
 * @example
 * extractJuntaId("/operaciones/junta-accionistas/123/resumen") // "123"
 * extractJuntaId("/operaciones/junta-accionistas/resumen") // null
 */
export function extractJuntaId(path: string): string | null {
  const match = path.match(/\/operaciones\/junta-accionistas\/([^/]+)/);
  return match && match[1] ? match[1] : null;
}

/**
 * Construye la ruta base para navegación
 * 
 * @param juntaId - ID de la junta (opcional)
 * @returns Ruta base
 * 
 * @example
 * buildBasePath("123") // "/operaciones/junta-accionistas/123"
 * buildBasePath() // "/operaciones/junta-accionistas"
 */
export function buildBasePath(juntaId?: string | null): string {
  return juntaId
    ? `/operaciones/junta-accionistas/${juntaId}`
    : `/operaciones/junta-accionistas`;
}

