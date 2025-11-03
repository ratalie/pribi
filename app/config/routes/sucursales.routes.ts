/**
 * Enums de Rutas: Sucursales
 *
 * Define todas las rutas (6) para el flujo de Registro de Sucursales.
 * Estructura plana (flat) sin jerarquía.
 *
 * @module SucursalesRoutes
 */

export enum SucursalesRoutes {
  /** Datos de la sociedad matriz */
  DATOS_SOCIEDAD = "/registro-societario/sucursales/datos-sociedad",

  /** Datos generales de la sucursal */
  DATOS_GENERALES = "/registro-societario/sucursales/datos-generales",

  /** Capital social */
  CAPITAL_SOCIAL = "/registro-societario/sucursales/capital-social",

  /** Configuración de acciones */
  ACCIONES = "/registro-societario/sucursales/acciones",

  /** Accionistas de la sucursal */
  ACCIONISTAS = "/registro-societario/sucursales/accionistas",

  /** Asignación de acciones */
  ASIGNACION_ACCIONES = "/registro-societario/sucursales/asignacion-acciones",
}

/**
 * Helper: Obtener nombre legible de una ruta
 */
export function getSucursalesRouteName(route: SucursalesRoutes): string {
  const names: Record<SucursalesRoutes, string> = {
    [SucursalesRoutes.DATOS_SOCIEDAD]: "Datos de la Sociedad",
    [SucursalesRoutes.DATOS_GENERALES]: "Datos Generales",
    [SucursalesRoutes.CAPITAL_SOCIAL]: "Capital Social",
    [SucursalesRoutes.ACCIONES]: "Acciones",
    [SucursalesRoutes.ACCIONISTAS]: "Accionistas",
    [SucursalesRoutes.ASIGNACION_ACCIONES]: "Asignación de Acciones",
  };

  return names[route] || route;
}

/**
 * Total de rutas definidas: 6
 * Estructura: Flat (sin jerarquía)
 */
