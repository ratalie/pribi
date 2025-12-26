/**
 * Tipos para la configuración simplificada de permisos
 */

/**
 * Rol simplificado según la UI
 */
export type SimpleRole = 'Administrador Superior' | 'Administrador' | 'Editor' | 'Lector' | 'Externo';

/**
 * Acciones de un sub-módulo
 */
export interface SubModuleActions {
  view: boolean;
  create: boolean;
  update: boolean;
  delete?: boolean;
  file?: boolean;
}

/**
 * Definición estática de un sub-módulo (configuración)
 */
export interface SubModuleDefinition {
  key: string;
  displayName: string;
  description?: string;
  backendModules: string[];
  defaultActions: SubModuleActions;
}

/**
 * Configuración dinámica de un sub-módulo (estado)
 */
export interface SubModuleConfig {
  key: string;
  displayName: string;
  description?: string;
  enabled: boolean;
  backendModules: string[];
  actions: SubModuleActions;
}

/**
 * Configuración de módulos
 */
export interface ModuleConfig {
  area: string; // REGISTROS, OPERACIONES, etc.
  enabled: boolean;
  submodules: SubModuleConfig[];
}

/**
 * Configuración de sociedades
 */
export interface SocietiesConfig {
  mode: 'all' | 'specific';
  ids: string[]; // IDs de sociedades seleccionadas
}

/**
 * Configuración de acciones
 */
export interface ActionsConfig {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  file: boolean;
}

/**
 * Configuración completa de permisos simplificada
 */
export interface SimplePermissionsConfig {
  role: SimpleRole;
  modules: ModuleConfig[];
  societies: SocietiesConfig;
  actions: ActionsConfig;
}

/**
 * Mapeo de roles simplificados a roles del backend
 */
export const ROLE_MAPPING: Record<SimpleRole, string> = {
  'Administrador Superior': 'AdministradorEstudio',
  Administrador: 'Administrador',
  Editor: 'Usuario',
  Lector: 'Lector',
  Externo: 'Externo',
};

/**
 * Áreas disponibles en el sistema
 */
export const AVAILABLE_AREAS = [
  'REGISTROS',
  'OPERACIONES',
  'REPOSITORIO_AI',
  'SUNAT',
  'ARCHIVES',
] as const;

export type AvailableArea = (typeof AVAILABLE_AREAS)[number];

/**
 * Acciones disponibles
 */
export const AVAILABLE_ACTIONS = ['view', 'create', 'update', 'delete', 'file'] as const;

export type AvailableAction = (typeof AVAILABLE_ACTIONS)[number];




