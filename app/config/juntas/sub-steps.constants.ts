/**
 * Constantes para Sub-steps de Juntas de Accionistas
 *
 * Lista de todos los sub-steps conocidos que NO deben activar el resumen general
 * cuando aparecen en rutas como /[sub-step]/resumen
 */

export const SUB_STEP_SLUGS = [
  "aporte-dinerario",
  "aporte-no-dinerario",
  "capitalizacion-creditos",
  "remocion-gerente",
  "remocion-apoderados",
  "remocion-directores",
  "nombramiento-gerente",
  "nombramiento-apoderados",
  "nombramiento-directores",
  "nombramiento-directorio",
  "pronunciamiento-gestion",
  "aplicacion-resultados",
  "nombramiento-auditores",
  "seleccion-agenda",
  "detalles",
  "instalacion",
  "puntos-acuerdo",
] as const;

export type SubStepSlug = (typeof SUB_STEP_SLUGS)[number];

/**
 * Verifica si un slug es un sub-step conocido
 */
export function isSubStepSlug(slug: string): slug is SubStepSlug {
  return SUB_STEP_SLUGS.includes(slug as SubStepSlug);
}
