/**
 * Mapeo de Rutas para Sistema de Permisos
 * 
 * Este archivo define todas las rutas que el admin puede administrar
 * para asignar permisos a usuarios.
 * 
 * Basado en: ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md
 */

export type RouteModule = 'REGISTROS' | 'OPERACIONES' | 'REPOSITORIO_AI';

export interface RoutePermissionConfig {
  route: string;
  module: RouteModule;
  displayName: string;
  description?: string;
}

/**
 * Configuración de rutas organizadas por módulo
 */
export const ROUTES_PERMISSIONS_MAP: Record<RouteModule, RoutePermissionConfig[]> = {
  REGISTROS: [
    {
      route: '/registros/sociedades',
      module: 'REGISTROS',
      displayName: 'Sociedades',
      description: 'Acceso al módulo de sociedades',
    },
    {
      route: '/registros/sociedades/dashboard',
      module: 'REGISTROS',
      displayName: 'Dashboard de Sociedades',
      description: 'Vista principal del módulo de sociedades',
    },
    {
      route: '/registros/sociedades/historial',
      module: 'REGISTROS',
      displayName: 'Historial de Sociedades',
      description: 'Listado de todas las sociedades registradas',
    },
    {
      route: '/registros/sociedades/crear',
      module: 'REGISTROS',
      displayName: 'Crear Sociedad',
      description: 'Formulario para crear una nueva sociedad',
    },
  ],

  OPERACIONES: [
    {
      route: '/operaciones/junta-accionistas/dashboard',
      module: 'OPERACIONES',
      displayName: 'Dashboard de Juntas',
      description: 'Vista principal de juntas de accionistas',
    },
    {
      route: '/operaciones/junta-accionistas/historial',
      module: 'OPERACIONES',
      displayName: 'Historial de Juntas',
      description: 'Listado de todas las juntas de accionistas',
    },
    {
      route: '/operaciones/junta-accionistas/crear',
      module: 'OPERACIONES',
      displayName: 'Crear Junta',
      description: 'Formulario para crear una nueva junta de accionistas',
    },
  ],

  REPOSITORIO_AI: [
    {
      route: '/repositorio-ai/carpetas-personalizadas',
      module: 'REPOSITORIO_AI',
      displayName: 'Carpetas Personalizadas',
      description: 'Gestión de carpetas personalizadas del repositorio',
    },
    {
      route: '/repositorio-ai/documentos-societarios',
      module: 'REPOSITORIO_AI',
      displayName: 'Documentos Societarios',
      description: 'Acceso a documentos societarios',
    },
    {
      route: '/repositorio-ai/archivos-generados',
      module: 'REPOSITORIO_AI',
      displayName: 'Archivos Generados',
      description: 'Archivos generados por el sistema',
    },
    {
      route: '/repositorio-ai/dashboard',
      module: 'REPOSITORIO_AI',
      displayName: 'Dashboard del Repositorio',
      description: 'Vista principal del repositorio',
    },
    {
      route: '/repositorio-ai/chat-ia',
      module: 'REPOSITORIO_AI',
      displayName: 'Chat IA',
      description: 'Acceso al chat con inteligencia artificial',
    },
  ],
};

/**
 * Obtiene todas las rutas en un array plano
 */
export function getAllRoutes(): RoutePermissionConfig[] {
  return Object.values(ROUTES_PERMISSIONS_MAP).flat();
}

/**
 * Obtiene rutas por módulo
 */
export function getRoutesByModule(module: RouteModule): RoutePermissionConfig[] {
  return ROUTES_PERMISSIONS_MAP[module] || [];
}

/**
 * Verifica si una ruta existe en el mapeo
 */
export function routeExists(route: string): boolean {
  return getAllRoutes().some((r) => r.route === route);
}

/**
 * Obtiene la configuración de una ruta específica
 */
export function getRouteConfig(route: string): RoutePermissionConfig | undefined {
  return getAllRoutes().find((r) => r.route === route);
}

/**
 * Nombres de módulos para mostrar en UI
 */
export const MODULE_DISPLAY_NAMES: Record<RouteModule, string> = {
  REGISTROS: 'Registros',
  OPERACIONES: 'Operaciones',
  REPOSITORIO_AI: 'Repositorio AI',
};

