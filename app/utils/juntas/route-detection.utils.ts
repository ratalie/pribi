/**
 * Utilidades para detección de rutas en el flujo de Juntas
 */

import { SUB_STEP_SLUGS } from "~/config/juntas/sub-steps.constants";

/**
 * Patrón regex para detectar rutas de resumen general
 * Formato: /operaciones/sociedades/{societyId}/junta-accionistas[/{flowId}]/resumen
 */
const RESUMEN_GENERAL_PATTERN = /^\/operaciones\/sociedades\/[^/]+\/junta-accionistas(\/[^/]+)?\/resumen$/;

/**
 * Detecta si una ruta es el resumen general
 * 
 * @param path - Ruta a verificar
 * @returns true si es resumen general, false si es resumen de sub-step
 * 
 * @example
 * isResumenGeneralPage("/operaciones/sociedades/30/junta-accionistas/resumen") // true
 * isResumenGeneralPage("/operaciones/sociedades/30/junta-accionistas/7/resumen") // true
 * isResumenGeneralPage("/operaciones/sociedades/30/junta-accionistas/aporte-dinerario/resumen") // false
 */
export function isResumenGeneralPage(path: string): boolean {
  // Verificar si la ruta termina en /resumen
  if (!path.endsWith("/resumen")) {
    return false;
  }

  // Patrón: /operaciones/sociedades/{societyId}/junta-accionistas[/{flowId}]/resumen
  // Con flowId: /operaciones/sociedades/30/junta-accionistas/7/resumen
  let match = path.match(/\/operaciones\/sociedades\/([^/]+)\/junta-accionistas\/([^/]+)\/resumen$/);
  if (match && match[1] && match[2]) {
    // Si el segundo segmento (después de junta-accionistas) es un sub-step conocido, NO es resumen general
    if (SUB_STEP_SLUGS.includes(match[2] as any)) {
      return false;
    }
    // Si es un ID (número o UUID), SÍ es resumen general
    return true;
  }

  // Sin flowId: /operaciones/sociedades/30/junta-accionistas/resumen
  match = path.match(/\/operaciones\/sociedades\/([^/]+)\/junta-accionistas\/resumen$/);
  if (match) {
    return true;
  }

  return false;
}

/**
 * Extrae el societyId de una ruta
 * 
 * @param path - Ruta a analizar
 * @returns ID de sociedad o null si no se encuentra
 * 
 * @example
 * extractSocietyId("/operaciones/sociedades/30/junta-accionistas/7/resumen") // "30"
 * extractSocietyId("/operaciones/sociedades/30/junta-accionistas/resumen") // "30"
 * extractSocietyId("/operaciones/sociedades/junta-accionistas/resumen") // null
 */
export function extractSocietyId(path: string): string | null {
  const match = path.match(/\/operaciones\/sociedades\/([^/]+)\/junta-accionistas/);
  return match && match[1] ? match[1] : null;
}

/**
 * Extrae el flowId de una ruta
 * 
 * @param path - Ruta a analizar
 * @returns ID del flujo/junta o null si no se encuentra
 * 
 * @example
 * extractFlowId("/operaciones/sociedades/30/junta-accionistas/7/resumen") // "7"
 * extractFlowId("/operaciones/sociedades/30/junta-accionistas/resumen") // null
 * extractFlowId("/operaciones/sociedades/30/junta-accionistas/aporte-dinerario") // null (es sub-step)
 */
export function extractFlowId(path: string): string | null {
  // Patrón: /operaciones/sociedades/{societyId}/junta-accionistas/{flowId}/...
  const match = path.match(/\/operaciones\/sociedades\/[^/]+\/junta-accionistas\/([^/]+)/);
  if (match && match[1]) {
    const segment = match[1];
    // Si es un sub-step conocido, NO es flowId
    if (SUB_STEP_SLUGS.includes(segment as any)) {
      return null;
    }
    // Si es un paso principal conocido, NO es flowId
    const mainSteps = ["seleccion-agenda", "detalles", "instalacion", "puntos-acuerdo", "resumen", "descargar"];
    if (mainSteps.includes(segment)) {
      return null;
    }
    // Probablemente es un flowId
    return segment;
  }
  return null;
}

/**
 * Extrae ambos IDs (societyId y flowId) de una ruta
 * 
 * @param path - Ruta a analizar
 * @returns Objeto con societyId y flowId, o null si no se encuentran
 * 
 * @example
 * extractJuntaIds("/operaciones/sociedades/30/junta-accionistas/7/resumen") // { societyId: "30", flowId: "7" }
 * extractJuntaIds("/operaciones/sociedades/30/junta-accionistas/resumen") // null
 */
export function extractJuntaIds(path: string): { societyId: string; flowId: string } | null {
  const match = path.match(/\/operaciones\/sociedades\/([^/]+)\/junta-accionistas\/([^/]+)/);
  if (match && match[1] && match[2]) {
    const flowId = match[2];
    // Verificar que no sea un sub-step o paso principal
    const mainSteps = ["seleccion-agenda", "detalles", "instalacion", "puntos-acuerdo", "resumen", "descargar"];
    if (SUB_STEP_SLUGS.includes(flowId as any) || mainSteps.includes(flowId)) {
      return null;
    }
    return {
      societyId: match[1],
      flowId: flowId,
    };
  }
  return null;
}

/**
 * Extrae el ID de junta de una ruta (compatibilidad hacia atrás)
 * 
 * @deprecated Usar extractFlowId() en su lugar
 * @param path - Ruta a analizar
 * @returns ID de junta o null si no se encuentra
 */
export function extractJuntaId(path: string): string | null {
  return extractFlowId(path);
}

/**
 * Construye la ruta base para navegación
 * 
 * @param societyId - ID de la sociedad (opcional)
 * @param flowId - ID del flujo/junta (opcional)
 * @returns Ruta base
 * 
 * @example
 * buildBasePath("30", "7") // "/operaciones/sociedades/30/junta-accionistas/7"
 * buildBasePath("30") // "/operaciones/sociedades/30/junta-accionistas"
 * buildBasePath() // "/operaciones/sociedades/:societyId/junta-accionistas"
 */
export function buildBasePath(
  societyId?: string | number | null,
  flowId?: string | number | null
): string {
  if (societyId && flowId) {
    return `/operaciones/sociedades/${societyId}/junta-accionistas/${flowId}`;
  }
  if (societyId) {
    return `/operaciones/sociedades/${societyId}/junta-accionistas`;
  }
  return `/operaciones/sociedades/:societyId/junta-accionistas`;
}

