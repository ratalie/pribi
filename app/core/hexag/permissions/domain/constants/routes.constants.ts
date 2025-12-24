/**
 * Constantes de Rutas del Sistema
 * 
 * Define las rutas disponibles en cada área del sistema.
 * Estas constantes se usan para mapear permisos del backend a rutas del frontend.
 */

/**
 * Rutas del área REGISTROS
 */
export const REGISTROS_ROUTES = {
  /** Dashboard de sociedades */
  DASHBOARD: {
    key: 'dashboard',
    path: '/registros/sociedades/dashboard',
    displayName: 'Dashboard',
    description: 'Vista general de sociedades',
  },
  
  /** Historial de sociedades */
  HISTORIAL: {
    key: 'historial',
    path: '/registros/sociedades/historial',
    displayName: 'Historial',
    description: 'Listado de todas las sociedades',
  },
  
  /** Crear nueva sociedad */
  CREAR: {
    key: 'crear',
    path: '/registros/sociedades/agregar',
    displayName: 'Crear Sociedad',
    description: 'Registrar una nueva sociedad',
  },
  
  /** Editar sociedad */
  EDITAR: {
    key: 'editar',
    path: '/registros/sociedades/:id',
    displayName: 'Editar Sociedad',
    description: 'Editar datos de una sociedad',
  },
} as const;

/**
 * Rutas del área OPERACIONES
 */
export const OPERACIONES_ROUTES = {
  /** Historial de juntas */
  HISTORIAL: {
    key: 'historial',
    path: '/operaciones/junta-accionistas/historial',
    displayName: 'Historial de Juntas',
    description: 'Listado de todas las juntas',
  },
  
  /** Crear nueva junta */
  CREAR: {
    key: 'crear',
    path: '/operaciones/junta-accionistas/crear',
    displayName: 'Crear Junta',
    description: 'Registrar una nueva junta de accionistas',
  },
  
  /** Editar junta */
  EDITAR: {
    key: 'editar',
    path: '/operaciones/junta-accionistas/:id',
    displayName: 'Editar Junta',
    description: 'Editar datos de una junta',
  },
} as const;

/**
 * Rutas del área REPOSITORIO_AI
 */
export const REPOSITORIO_AI_ROUTES = {
  /** Dashboard del repositorio */
  DASHBOARD: {
    key: 'dashboard',
    path: '/repositorio-ai/dashboard',
    displayName: 'Dashboard',
    description: 'Vista general del repositorio',
  },
  
  /** Buscar documentos */
  BUSCAR: {
    key: 'buscar',
    path: '/repositorio-ai/buscar',
    displayName: 'Buscar',
    description: 'Buscar documentos en el repositorio',
  },
} as const;

/**
 * Rutas del área SUNAT
 */
export const SUNAT_ROUTES = {
  /** Dashboard de SUNAT */
  DASHBOARD: {
    key: 'dashboard',
    path: '/sunat/dashboard',
    displayName: 'Dashboard',
    description: 'Vista general de integración SUNAT',
  },
} as const;

/**
 * Rutas del área ARCHIVES
 */
export const ARCHIVES_ROUTES = {
  /** Dashboard de archivos */
  DASHBOARD: {
    key: 'dashboard',
    path: '/archives/dashboard',
    displayName: 'Dashboard',
    description: 'Vista general de archivos',
  },
} as const;

/**
 * Mapa completo de todas las rutas por área
 */
export const ALL_ROUTES = {
  REGISTROS: REGISTROS_ROUTES,
  OPERACIONES: OPERACIONES_ROUTES,
  REPOSITORIO_AI: REPOSITORIO_AI_ROUTES,
  SUNAT: SUNAT_ROUTES,
  ARCHIVES: ARCHIVES_ROUTES,
} as const;

/**
 * Obtiene todas las rutas como array plano
 */
export function getAllRoutes(): Array<{ key: string; path: string; displayName: string; description?: string }> {
  return Object.values(ALL_ROUTES).flatMap(areaRoutes => Object.values(areaRoutes));
}

/**
 * Obtiene una ruta por su clave
 */
export function getRouteByKey(key: string): { key: string; path: string; displayName: string; description?: string } | undefined {
  return getAllRoutes().find(route => route.key === key);
}






