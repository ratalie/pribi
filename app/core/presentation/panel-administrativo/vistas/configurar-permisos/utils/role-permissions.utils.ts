import type { SimpleRole } from "../types/configurar-permisos.types";
import type { ActionsConfig } from "../types/configurar-permisos.types";

/**
 * Permisos base por rol
 * Estos son los permisos que se aplican automáticamente al seleccionar un rol
 */
export const ROLE_DEFAULT_PERMISSIONS: Record<SimpleRole, ActionsConfig> = {
  "Administrador Superior": {
    view: true,
    create: true,
    update: true,
    delete: true,
    file: true,
  },
  Administrador: {
    view: true,
    create: true,
    update: true,
    delete: true,
    file: true,
  },
  Editor: {
    view: true,
    create: true,
    update: true,
    delete: true,
    file: false, // Editor no puede archivar por defecto
  },
  Lector: {
    view: true,
    create: false,
    update: false,
    delete: false,
    file: false,
  },
  Externo: {
    view: true,
    create: false,
    update: false,
    delete: false,
    file: false,
  },
};

/**
 * Obtiene los permisos base para un rol específico
 * @param role - Rol del usuario
 * @returns Configuración de acciones por defecto para ese rol
 */
export function getDefaultPermissionsForRole(role: SimpleRole): ActionsConfig {
  return { ...ROLE_DEFAULT_PERMISSIONS[role] };
}

/**
 * Valida si un permiso es compatible con un rol
 * @param role - Rol del usuario
 * @param action - Acción a validar
 * @param value - Valor de la acción
 * @returns true si el permiso es válido para el rol
 */
export function isPermissionValidForRole(
  role: SimpleRole,
  action: keyof ActionsConfig,
  value: boolean
): boolean {
  const defaults = ROLE_DEFAULT_PERMISSIONS[role];

  // Si es Lector o Externo, solo puede tener 'view' activado
  if (role === "Lector" || role === "Externo") {
    if (action === "view") {
      return value === true; // Lector/Externo siempre debe tener view
    }
    return value === false; // Lector/Externo no puede tener otras acciones
  }

  // Para otros roles, validar según los defaults
  if (value === true) {
    // Si intenta activar un permiso, verificar que el rol lo permite por defecto
    return defaults[action] === true;
  }

  // Desactivar permisos siempre es válido (excepto view para Lector)
  return true;
}
