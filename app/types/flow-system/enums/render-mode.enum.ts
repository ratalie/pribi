/**
 * Modos de renderizado para el sidebar
 *
 * Define cómo se debe mostrar la estructura de navegación
 * en el sidebar del flujo.
 *
 * @module RenderMode
 */

/**
 * Modos de renderizado disponibles
 */
export enum RenderMode {
  /** Renderizado jerárquico con anidación (árbol) */
  HIERARCHICAL = "hierarchical",

  /** Renderizado secuencial lineal (lista plana) */
  SEQUENTIAL = "sequential",

  /** Renderizado mixto (combina jerárquico y secuencial) */
  MIXED = "mixed",

  /** Renderizado de acordeón (collapse/expand) */
  ACCORDION = "accordion",

  /** Renderizado de tabs */
  TABS = "tabs",

  /** Renderizado tipo stepper horizontal */
  STEPPER = "stepper",
}

/**
 * Type guard para verificar si un string es un RenderMode válido
 */
export function isRenderMode(value: unknown): value is RenderMode {
  return Object.values(RenderMode).includes(value as RenderMode);
}

/**
 * Obtener label legible para UI
 */
export function getRenderModeLabel(mode: RenderMode): string {
  const labels: Record<RenderMode, string> = {
    [RenderMode.HIERARCHICAL]: "Jerárquico",
    [RenderMode.SEQUENTIAL]: "Secuencial",
    [RenderMode.MIXED]: "Mixto",
    [RenderMode.ACCORDION]: "Acordeón",
    [RenderMode.TABS]: "Pestañas",
    [RenderMode.STEPPER]: "Stepper",
  };

  return labels[mode];
}

/**
 * Obtener descripción del modo
 */
export function getRenderModeDescription(mode: RenderMode): string {
  const descriptions: Record<RenderMode, string> = {
    [RenderMode.HIERARCHICAL]: "Muestra items en estructura de árbol con niveles anidados",
    [RenderMode.SEQUENTIAL]: "Muestra items en lista plana secuencial",
    [RenderMode.MIXED]: "Combina renderizado jerárquico con secuencial",
    [RenderMode.ACCORDION]: "Permite expandir/colapsar secciones",
    [RenderMode.TABS]: "Muestra items como pestañas horizontales",
    [RenderMode.STEPPER]: "Muestra progreso lineal como steps",
  };

  return descriptions[mode];
}
