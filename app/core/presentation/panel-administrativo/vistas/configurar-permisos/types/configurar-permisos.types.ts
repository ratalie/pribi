/**
 * Tipos para la configuración simplificada de permisos
 */

/**
 * Rol simplificado según la UI
 */
export type SimpleRole = 'Administrador' | 'Editor' | 'Lector';

/**
 * Configuración de módulos
 */
export interface ModuleConfig {
  area: string; // REGISTROS, OPERACIONES, etc.
  enabled: boolean;
  submodules?: {
    key: string; // society, shareholder, etc.
    enabled: boolean;
  }[];
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
  Administrador: 'Administrador',
  Editor: 'Usuario',
  Lector: 'Lector',
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




