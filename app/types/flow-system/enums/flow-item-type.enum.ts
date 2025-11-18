/**
 * Tipos de elementos en el sistema de flujos
 *
 * Define las diferentes categorías de items que pueden aparecer
 * en los sidebars y flujos de navegación.
 *
 * @module FlowItemType
 */

/**
 * Categorías principales de FlowItems
 */
export enum FlowItemType {
  /** Sección que agrupa múltiples steps */
  SECTION = "section",

  /** Paso individual en el flujo */
  STEP = "step",

  /** Subsección dentro de una sección */
  SUBSECTION = "subsection",

  /** Elemento de acción (botón, link) */
  ACTION = "action",

  /** Separador visual */
  DIVIDER = "divider",

  /** Encabezado informativo */
  HEADER = "header",

  /** Elemento customizado */
  CUSTOM = "custom",
}

/**
 * Type guard para verificar si un string es un FlowItemType válido
 */
export function isFlowItemType(value: unknown): value is FlowItemType {
  return Object.values(FlowItemType).includes(value as FlowItemType);
}

/**
 * Obtener label legible para UI
 */
export function getFlowItemTypeLabel(type: FlowItemType): string {
  const labels: Record<FlowItemType, string> = {
    [FlowItemType.SECTION]: "Sección",
    [FlowItemType.STEP]: "Paso",
    [FlowItemType.SUBSECTION]: "Subsección",
    [FlowItemType.ACTION]: "Acción",
    [FlowItemType.DIVIDER]: "Separador",
    [FlowItemType.HEADER]: "Encabezado",
    [FlowItemType.CUSTOM]: "Personalizado",
  };

  return labels[type];
}
