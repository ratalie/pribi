/**
 * Configuración completa del layout universal
 *
 * Define la estructura completa de un layout con sidebars dinámicos,
 * header, footer, y comportamiento del flujo.
 *
 * @example
 * ```typescript
 * const juntasLayout: FlowLayoutConfig = {
 *   id: 'juntas-layout',
 *   name: 'Junta de Accionistas',
 *   type: 'wizard',
 *   sidebars: [leftSidebar, rightSidebar],
 *   persistProgress: true,
 * };
 * ```
 */

import type { Component } from "vue";
import type { FlowConfig } from "../flow-system/flow-config";
import type { SidebarConfig } from "./sidebar-config";

/**
 * Tipos de layout soportados
 */
export type FlowLayoutType = "wizard" | "documentation" | "dashboard" | "custom";

/**
 * Configuración de header del layout
 */
export interface LayoutHeaderConfig {
  /**
   * Componente Vue a renderizar
   */
  component: Component;

  /**
   * Props a pasar al componente
   */
  props?: Record<string, any>;

  /**
   * ¿Mostrar el header?
   * @default true
   */
  visible?: boolean;

  /**
   * Altura del header
   * @default 'auto'
   */
  height?: string;

  /**
   * ¿El header es sticky?
   * @default false
   */
  sticky?: boolean;
}

/**
 * Configuración de footer del layout
 */
export interface LayoutFooterConfig {
  /**
   * Componente Vue a renderizar
   */
  component: Component;

  /**
   * Props a pasar al componente
   */
  props?: Record<string, any>;

  /**
   * ¿Mostrar el footer?
   * @default true
   */
  visible?: boolean;

  /**
   * Altura del footer
   * @default 'auto'
   */
  height?: string;

  /**
   * ¿El footer es sticky?
   * @default true
   */
  sticky?: boolean;
}

/**
 * Opciones de persistencia de progreso
 */
export interface PersistenceOptions {
  /**
   * ¿Habilitar persistencia?
   * @default false
   */
  enabled: boolean;

  /**
   * Guardar en localStorage
   * @default true
   */
  localStorage?: boolean;

  /**
   * Guardar en backend (API)
   * @default true
   */
  backend?: boolean;

  /**
   * Clave para localStorage
   * Si se omite, usa `probo_flow_${flowId}`
   */
  storageKey?: string;

  /**
   * Endpoint de la API para guardar progreso
   * @default '/api/flows/:flowId/progress'
   */
  apiEndpoint?: string;

  /**
   * Intervalo de guardado automático (ms)
   * @default 30000 (30 segundos)
   */
  autoSaveInterval?: number;
}

/**
 * Opciones de validación
 */
export interface ValidationOptions {
  /**
   * ¿Validar antes de navegar?
   * @default true
   */
  validateOnNavigate: boolean;

  /**
   * ¿Validar antes de completar?
   * @default true
   */
  validateOnComplete?: boolean;

  /**
   * ¿Mostrar errores de validación?
   * @default true
   */
  showValidationErrors?: boolean;

  /**
   * ¿Permitir navegación con errores?
   * @default false
   */
  allowNavigationWithErrors?: boolean;
}

/**
 * Opciones de navegación
 */
export interface NavigationOptions {
  /**
   * ¿Permitir navegación libre entre pasos?
   * @default true
   */
  allowFreeNavigation?: boolean;

  /**
   * ¿Marcar pasos anteriores como completados?
   * @default true
   */
  markPreviousAsCompleted?: boolean;

  /**
   * ¿Scroll al top al navegar?
   * @default true
   */
  scrollToTop?: boolean;

  /**
   * ¿Usar transiciones al navegar?
   * @default true
   */
  useTransitions?: boolean;

  /**
   * Nombre de la transición
   * @default 'fade'
   */
  transitionName?: string;
}

/**
 * Opciones de animaciones
 */
export interface AnimationOptions {
  /**
   * ¿Habilitar animaciones?
   * @default true
   */
  enabled?: boolean;

  /**
   * Duración de animaciones (ms)
   * @default 300
   */
  duration?: number;

  /**
   * Función de easing
   * @default 'ease-in-out'
   */
  easing?: string;
}

/**
 * Configuración completa del layout universal
 *
 * Esta es la estructura principal que define todo el comportamiento
 * de un layout con sidebars dinámicos.
 */
export interface FlowLayoutConfig {
  // ============================================
  // IDENTIFICACIÓN
  // ============================================

  /**
   * ID único del layout
   * @example 'juntas-layout', 'sucursales-layout'
   */
  id: string;

  /**
   * Nombre descriptivo del layout
   * @example 'Junta de Accionistas', 'Registro de Sucursales'
   */
  name: string;

  /**
   * Tipo de layout
   */
  type: FlowLayoutType;

  /**
   * Versión del layout (para migraciones)
   * @default '1.0.0'
   */
  version?: string;

  // ============================================
  // ESTRUCTURA
  // ============================================

  /**
   * Configuración de sidebars
   * Puede ser 1, 2, 3 o más sidebars
   */
  sidebars: SidebarConfig[];

  /**
   * Configuración del header (opcional)
   */
  header?: LayoutHeaderConfig;

  /**
   * Configuración del footer (opcional)
   */
  footer?: LayoutFooterConfig;

  // ============================================
  // FLUJO (OPCIONAL)
  // ============================================

  /**
   * Configuración del flujo asociado
   * Si se proporciona, el layout puede gestionar navegación de pasos
   */
  flowConfig?: FlowConfig;

  /**
   * ID del flujo (alternativa a flowConfig)
   * Se cargará dinámicamente
   */
  flowId?: string;

  // ============================================
  // COMPORTAMIENTO
  // ============================================

  /**
   * Opciones de persistencia de progreso
   */
  persistence?: PersistenceOptions;

  /**
   * Opciones de validación
   */
  validation?: ValidationOptions;

  /**
   * Opciones de navegación
   */
  navigation?: NavigationOptions;

  /**
   * Opciones de animaciones
   */
  animations?: AnimationOptions;

  // ============================================
  // ESTADOS DE CARGA
  // ============================================

  /**
   * ¿Mostrar skeleton mientras carga?
   * @default true
   */
  showLoadingSkeleton?: boolean;

  /**
   * ¿Mostrar indicador de guardado?
   * @default true
   */
  showSaveIndicator?: boolean;

  // ============================================
  // RESPONSIVE
  // ============================================

  /**
   * Breakpoints personalizados (opcional)
   */
  breakpoints?: {
    mobile?: number; // @default 768
    tablet?: number; // @default 1024
    desktop?: number; // @default 1280
  };

  /**
   * Comportamiento en mobile
   */
  mobileOptions?: {
    /**
     * ¿Colapsar sidebars por defecto?
     * @default true
     */
    collapseSidebarsByDefault?: boolean;

    /**
     * ¿Mostrar sidebars como drawers?
     * @default true
     */
    useDrawers?: boolean;

    /**
     * ¿Ocultar header en mobile?
     * @default false
     */
    hideHeader?: boolean;
  };

  // ============================================
  // METADATA
  // ============================================

  /**
   * Metadata adicional (para extensiones futuras)
   */
  meta?: Record<string, any>;
}

/**
 * Configuración con valores por defecto aplicados
 * (usado internamente por UniversalFlowLayout)
 */
export interface FlowLayoutConfigResolved extends FlowLayoutConfig {
  /**
   * Persistencia con valores por defecto
   */
  persistence: Required<PersistenceOptions>;

  /**
   * Validación con valores por defecto
   */
  validation: Required<ValidationOptions>;

  /**
   * Navegación con valores por defecto
   */
  navigation: Required<NavigationOptions>;

  /**
   * Animaciones con valores por defecto
   */
  animations: Required<AnimationOptions>;

  /**
   * Breakpoints resueltos
   */
  breakpoints: Required<NonNullable<FlowLayoutConfig["breakpoints"]>>;

  /**
   * Opciones mobile resueltas
   */
  mobileOptions: Required<NonNullable<FlowLayoutConfig["mobileOptions"]>>;
}

/**
 * Helper para crear configuración de layout con valores por defecto
 *
 * @example
 * ```typescript
 * const layout = defineFlowLayout({
 *   id: 'juntas-layout',
 *   name: 'Juntas',
 *   type: 'wizard',
 *   sidebars: [leftSidebar, rightSidebar],
 * });
 * ```
 */
export function defineFlowLayout(config: FlowLayoutConfig): FlowLayoutConfig {
  return config;
}
