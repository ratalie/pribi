/**
 * FlowItemRightSidebar
 *
 * Define la configuración del right sidebar contextual.
 *
 * @module FlowItemRightSidebar
 */

/**
 * Tipo de contenido del right sidebar
 */
export type RightSidebarContentType =
  | "help" // Ayuda contextual
  | "info" // Información adicional
  | "preview" // Vista previa
  | "actions" // Acciones rápidas
  | "history" // Historial
  | "comments" // Comentarios
  | "custom"; // Componente personalizado

/**
 * Interfaz para el right sidebar de un FlowItem
 *
 * Agrupa toda la configuración del sidebar contextual
 * que aparece a la derecha del contenido principal.
 */
export interface FlowItemRightSidebar {
  /**
   * Mostrar right sidebar para este item
   *
   * @default false
   */
  enabled: boolean;

  /**
   * Tipo de contenido del sidebar
   *
   * @default 'help'
   */
  contentType?: RightSidebarContentType;

  /**
   * Título del sidebar
   *
   * @example 'Ayuda: Datos Generales'
   */
  title?: string;

  /**
   * Contenido en markdown o HTML (para tipos simples)
   *
   * @example '## Datos Generales\n\nComplete la información...'
   */
  content?: string;

  /**
   * Nombre del componente Vue a renderizar (para custom)
   *
   * @example 'RightSidebarCustomHelp'
   */
  component?: string;

  /**
   * Props a pasar al componente
   *
   * @example { itemId: 'paso-1', data: {...} }
   */
  componentProps?: Record<string, unknown>;

  /**
   * Ancho del sidebar en píxeles
   *
   * @default 320
   */
  width?: number;

  /**
   * Ancho mínimo del sidebar
   *
   * @default 280
   */
  minWidth?: number;

  /**
   * Ancho máximo del sidebar
   *
   * @default 480
   */
  maxWidth?: number;

  /**
   * Es redimensionable
   *
   * @default true
   */
  resizable?: boolean;

  /**
   * Es colapsable
   *
   * @default true
   */
  collapsible?: boolean;

  /**
   * Inicia colapsado
   *
   * @default false
   */
  startCollapsed?: boolean;

  /**
   * Posición sticky (se queda fijo al hacer scroll)
   *
   * @default true
   */
  sticky?: boolean;

  /**
   * Lista de acciones disponibles en el sidebar
   */
  actions?: RightSidebarAction[];

  /**
   * Enlaces relacionados
   */
  relatedLinks?: RightSidebarLink[];

  /**
   * Mostrar en modo móvil (bottom sheet)
   *
   * @default true
   */
  showOnMobile?: boolean;
}

/**
 * Acción disponible en el right sidebar
 */
export interface RightSidebarAction {
  /**
   * ID único de la acción
   */
  id: string;

  /**
   * Label del botón
   */
  label: string;

  /**
   * Icono del botón
   */
  icon?: string;

  /**
   * Handler de la acción
   */
  handler: () => void | Promise<void>;

  /**
   * Variante del botón
   */
  variant?: "default" | "outline" | "ghost" | "destructive";

  /**
   * Está deshabilitada
   */
  disabled?: boolean;
}

/**
 * Link relacionado en el right sidebar
 */
export interface RightSidebarLink {
  /**
   * Texto del link
   */
  label: string;

  /**
   * URL del link
   */
  url: string;

  /**
   * Icono del link
   */
  icon?: string;

  /**
   * Abrir en nueva pestaña
   *
   * @default false
   */
  external?: boolean;
}
