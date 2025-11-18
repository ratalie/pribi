/**
 * FlowConfig - Configuración de Flujo
 *
 * Define la configuración completa de un flujo de navegación,
 * incluyendo todos los FlowItems y opciones de renderizado.
 *
 * @module FlowConfig
 */

import type { RenderMode, SidebarPosition } from "./enums";
import type { FlowItem } from "./flow-item";

/**
 * FlowConfig - Configuración completa de un flujo
 *
 * Representa la configuración de un flujo completo de navegación,
 * como el flujo de Registro Societario o Juntas de Accionistas.
 *
 * @example
 * ```typescript
 * const registroFlowConfig: FlowConfig = {
 *   id: 'registro-societario-flow',
 *   name: 'Registro Societario',
 *   description: 'Flujo para registro de nuevas sociedades',
 *   items: [...], // Array de FlowItems
 *   renderOptions: {
 *     mode: RenderMode.HIERARCHICAL,
 *     showProgress: true,
 *     showCompletionStatus: true
 *   },
 *   sidebarOptions: {
 *     position: SidebarPosition.LEFT,
 *     width: 280,
 *     collapsible: true,
 *     sticky: true
 *   }
 * };
 * ```
 */
export interface FlowConfig {
  /**
   * Identificador único del flujo
   *
   * @example 'registro-societario-flow', 'juntas-accionistas-flow'
   */
  id: string;

  /**
   * Nombre del flujo
   *
   * @example 'Registro Societario', 'Juntas de Accionistas'
   */
  name: string;

  /**
   * Descripción del flujo
   *
   * @example 'Flujo completo para el registro de nuevas sociedades'
   */
  description?: string;

  /**
   * Versión de la configuración
   *
   * @example '1.0.0', '2.1.3'
   */
  version?: string;

  /**
   * Array de FlowItems que componen el flujo
   * El orden en el array NO determina el orden visual
   * (eso lo determina hierarchy.order)
   */
  items: FlowItem[];

  /**
   * Opciones de renderizado del flujo
   */
  renderOptions: FlowRenderOptions;

  /**
   * Opciones del sidebar principal
   */
  sidebarOptions: FlowSidebarOptions;

  /**
   * Opciones del right sidebar (opcional)
   */
  rightSidebarOptions?: FlowRightSidebarOptions;

  /**
   * Hooks del ciclo de vida del flujo (opcional)
   */
  lifecycle?: FlowLifecycleHooks;

  /**
   * Permisos requeridos para acceder al flujo (opcional)
   */
  permissions?: string[];

  /**
   * Roles permitidos (opcional)
   */
  roles?: string[];

  /**
   * Metadata adicional
   */
  metadata?: Record<string, unknown>;

  /**
   * Timestamp de creación
   */
  createdAt?: Date;

  /**
   * Timestamp de última actualización
   */
  updatedAt?: Date;
}

/**
 * Opciones de renderizado del flujo
 */
export interface FlowRenderOptions {
  /**
   * Modo de renderizado principal
   */
  mode: RenderMode;

  /**
   * Modo de renderizado alternativo (para responsive)
   */
  mobileMode?: RenderMode;

  /**
   * Mostrar barra de progreso global
   *
   * @default true
   */
  showProgress?: boolean;

  /**
   * Mostrar indicador de completación en items
   *
   * @default true
   */
  showCompletionStatus?: boolean;

  /**
   * Mostrar iconos en items
   *
   * @default true
   */
  showIcons?: boolean;

  /**
   * Mostrar badges en items
   *
   * @default true
   */
  showBadges?: boolean;

  /**
   * Mostrar números de paso
   *
   * @default false
   */
  showStepNumbers?: boolean;

  /**
   * Permitir navegación libre (no secuencial)
   *
   * @default false
   */
  allowFreeNavigation?: boolean;

  /**
   * Animar transiciones entre items
   *
   * @default true
   */
  animateTransitions?: boolean;

  /**
   * Duración de animaciones en ms
   *
   * @default 300
   */
  animationDuration?: number;

  /**
   * Resaltar item activo
   *
   * @default true
   */
  highlightActive?: boolean;

  /**
   * Color del tema (Tailwind class)
   *
   * @example 'blue', 'purple', 'green'
   */
  themeColor?: string;

  /**
   * Clases CSS personalizadas para el contenedor
   */
  customClasses?: string;
}

/**
 * Opciones del sidebar principal
 */
export interface FlowSidebarOptions {
  /**
   * Posición del sidebar
   */
  position: SidebarPosition;

  /**
   * Ancho del sidebar en píxeles
   *
   * @default 280
   */
  width?: number;

  /**
   * Ancho mínimo del sidebar
   *
   * @default 240
   */
  minWidth?: number;

  /**
   * Ancho máximo del sidebar
   *
   * @default 400
   */
  maxWidth?: number;

  /**
   * El sidebar es colapsable
   *
   * @default true
   */
  collapsible?: boolean;

  /**
   * Iniciar colapsado en desktop
   *
   * @default false
   */
  startCollapsed?: boolean;

  /**
   * Iniciar colapsado en mobile
   *
   * @default true
   */
  startCollapsedMobile?: boolean;

  /**
   * El sidebar es redimensionable
   *
   * @default true
   */
  resizable?: boolean;

  /**
   * Posición sticky (se queda fijo al hacer scroll)
   *
   * @default true
   */
  sticky?: boolean;

  /**
   * Offset desde el top para sticky (en píxeles)
   *
   * @default 0
   */
  stickyOffset?: number;

  /**
   * Mostrar encabezado del sidebar
   *
   * @default true
   */
  showHeader?: boolean;

  /**
   * Título del encabezado
   */
  headerTitle?: string;

  /**
   * Mostrar footer del sidebar
   *
   * @default false
   */
  showFooter?: boolean;

  /**
   * Componente personalizado para el footer
   */
  footerComponent?: string;

  /**
   * Clases CSS personalizadas
   */
  customClasses?: string;

  /**
   * Comportamiento en mobile
   *
   * @default 'drawer' - Se muestra como drawer deslizante
   * @option 'bottom-sheet' - Se muestra como bottom sheet
   * @option 'hidden' - Se oculta completamente
   */
  mobileVariant?: "drawer" | "bottom-sheet" | "hidden";
}

/**
 * Opciones del right sidebar global
 */
export interface FlowRightSidebarOptions {
  /**
   * Habilitar right sidebar globalmente
   *
   * @default false
   */
  enabled: boolean;

  /**
   * Ancho por defecto
   *
   * @default 320
   */
  defaultWidth?: number;

  /**
   * Posición sticky
   *
   * @default true
   */
  sticky?: boolean;

  /**
   * Offset desde el top
   *
   * @default 0
   */
  stickyOffset?: number;

  /**
   * Permitir que items individuales lo sobrescriban
   *
   * @default true
   */
  allowItemOverride?: boolean;
}

/**
 * Hooks del ciclo de vida del flujo
 */
export interface FlowLifecycleHooks {
  /**
   * Se ejecuta al montar el flujo
   */
  onMount?: () => void | Promise<void>;

  /**
   * Se ejecuta al desmontar el flujo
   */
  onUnmount?: () => void | Promise<void>;

  /**
   * Se ejecuta antes de navegar a un item
   * Retorna false para cancelar navegación
   */
  beforeNavigate?: (from: string | null, to: string) => boolean | Promise<boolean>;

  /**
   * Se ejecuta después de navegar a un item
   */
  afterNavigate?: (from: string | null, to: string) => void | Promise<void>;

  /**
   * Se ejecuta cuando se completa un item
   */
  onItemComplete?: (itemId: string) => void | Promise<void>;

  /**
   * Se ejecuta cuando se completa todo el flujo
   */
  onFlowComplete?: () => void | Promise<void>;

  /**
   * Se ejecuta cuando cambia el progreso
   */
  onProgressChange?: (progress: number) => void | Promise<void>;
}

/**
 * FlowConfig parcial para creación
 */
export type FlowConfigInput = Pick<
  FlowConfig,
  "id" | "name" | "items" | "renderOptions" | "sidebarOptions"
> &
  Partial<Omit<FlowConfig, "id" | "name" | "items" | "renderOptions" | "sidebarOptions">>;

/**
 * FlowConfig para actualización
 */
export type FlowConfigUpdate = Partial<FlowConfig> & {
  id: string;
};
