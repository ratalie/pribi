/**
 * Posiciones del sidebar
 *
 * Define dónde se puede posicionar el sidebar en el layout.
 *
 * @module SidebarPosition
 */

/**
 * Posiciones disponibles para el sidebar
 */
export enum SidebarPosition {
  /** Sidebar a la izquierda del contenido */
  LEFT = "left",

  /** Sidebar a la derecha del contenido */
  RIGHT = "right",

  /** Sidebar en la parte superior (horizontal) */
  TOP = "top",

  /** Sidebar en la parte inferior (horizontal) */
  BOTTOM = "bottom",
}

/**
 * Type guard para verificar si un string es un SidebarPosition válido
 */
export function isSidebarPosition(value: unknown): value is SidebarPosition {
  return Object.values(SidebarPosition).includes(value as SidebarPosition);
}

/**
 * Obtener label legible para UI
 */
export function getSidebarPositionLabel(position: SidebarPosition): string {
  const labels: Record<SidebarPosition, string> = {
    [SidebarPosition.LEFT]: "Izquierda",
    [SidebarPosition.RIGHT]: "Derecha",
    [SidebarPosition.TOP]: "Superior",
    [SidebarPosition.BOTTOM]: "Inferior",
  };

  return labels[position];
}

/**
 * Verificar si la posición es vertical (left/right)
 */
export function isVerticalPosition(position: SidebarPosition): boolean {
  return [SidebarPosition.LEFT, SidebarPosition.RIGHT].includes(position);
}

/**
 * Verificar si la posición es horizontal (top/bottom)
 */
export function isHorizontalPosition(position: SidebarPosition): boolean {
  return [SidebarPosition.TOP, SidebarPosition.BOTTOM].includes(position);
}

/**
 * Obtener clase Tailwind para el contenedor según posición
 */
export function getSidebarPositionClass(position: SidebarPosition): string {
  const classes: Record<SidebarPosition, string> = {
    [SidebarPosition.LEFT]: "flex-row",
    [SidebarPosition.RIGHT]: "flex-row-reverse",
    [SidebarPosition.TOP]: "flex-col",
    [SidebarPosition.BOTTOM]: "flex-col-reverse",
  };

  return classes[position];
}
