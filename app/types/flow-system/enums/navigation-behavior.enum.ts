/**
 * Comportamientos de navegación
 *
 * Define cómo se debe manejar la navegación cuando el usuario
 * interactúa con un FlowItem.
 *
 * @module NavigationBehavior
 */

/**
 * Tipos de comportamiento de navegación
 */
export enum NavigationBehavior {
  /** Navegación mediante router push (cambia URL) */
  PUSH = "push",

  /** Navegación mediante router replace (reemplaza URL) */
  REPLACE = "replace",

  /** Emite evento pero no navega automáticamente */
  EMIT = "emit",

  /** No hace nada (item informativo) */
  NONE = "none",

  /** Scroll a una sección de la página */
  SCROLL = "scroll",

  /** Abre modal/dialog */
  MODAL = "modal",

  /** Abre en nueva pestaña */
  NEW_TAB = "new-tab",

  /** Navegación externa (fuera de la app) */
  EXTERNAL = "external",
}

/**
 * Type guard para verificar si un string es un NavigationBehavior válido
 */
export function isNavigationBehavior(value: unknown): value is NavigationBehavior {
  return Object.values(NavigationBehavior).includes(value as NavigationBehavior);
}

/**
 * Obtener label legible para UI
 */
export function getNavigationBehaviorLabel(behavior: NavigationBehavior): string {
  const labels: Record<NavigationBehavior, string> = {
    [NavigationBehavior.PUSH]: "Navegar (Push)",
    [NavigationBehavior.REPLACE]: "Reemplazar URL",
    [NavigationBehavior.EMIT]: "Emitir Evento",
    [NavigationBehavior.NONE]: "Sin Acción",
    [NavigationBehavior.SCROLL]: "Scroll a Sección",
    [NavigationBehavior.MODAL]: "Abrir Modal",
    [NavigationBehavior.NEW_TAB]: "Nueva Pestaña",
    [NavigationBehavior.EXTERNAL]: "Link Externo",
  };

  return labels[behavior];
}

/**
 * Verificar si el comportamiento requiere una URL
 */
export function requiresUrl(behavior: NavigationBehavior): boolean {
  return [
    NavigationBehavior.PUSH,
    NavigationBehavior.REPLACE,
    NavigationBehavior.NEW_TAB,
    NavigationBehavior.EXTERNAL,
  ].includes(behavior);
}

/**
 * Verificar si el comportamiento cambia la URL del browser
 */
export function changesUrl(behavior: NavigationBehavior): boolean {
  return [NavigationBehavior.PUSH, NavigationBehavior.REPLACE].includes(behavior);
}
