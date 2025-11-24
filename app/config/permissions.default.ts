/**
 * Configuración de Permisos por Defecto
 * 
 * Este archivo define los permisos por defecto que se usarán:
 * 1. En MSW cuando no hay backend
 * 2. Como fallback cuando el backend no devuelve permisos
 * 3. Para usuarios admin por defecto
 * 
 * Basado en: Admin Panel de Figma
 */

import type { UserPermissions, CRUD, WorkspaceFeatures } from "~/types/permissions";

/**
 * Permisos CRUD completos (Admin)
 */
export const FULL_CRUD: CRUD = {
  create: true,
  read: true,
  update: true,
  delete: true,
};

/**
 * Permisos de solo lectura
 */
export const READ_ONLY_CRUD: CRUD = {
  create: false,
  read: true,
  update: false,
  delete: false,
};

/**
 * Permisos de lectura y escritura (sin eliminar)
 */
export const READ_WRITE_CRUD: CRUD = {
  create: true,
  read: true,
  update: true,
  delete: false,
};

/**
 * Permisos por defecto para Administrador
 * 
 * El admin tiene acceso total a todo el sistema
 */
export const DEFAULT_ADMIN_PERMISSIONS: UserPermissions = {
  userId: "admin-default",
  systemFeatures: {
    societies: FULL_CRUD,
    shareholders: FULL_CRUD,
    directory: FULL_CRUD,
    juntas: FULL_CRUD,
    chatAI: true,
    userManagement: true,
  },
  repositoryAccess: {
    fullAccess: true,
    permissions: {
      view: true,
      download: true,
      upload: true,
      delete: true,
      search: true,
    },
  },
};

/**
 * Permisos por defecto para Usuario Estándar
 * 
 * Usuario con permisos limitados
 */
export const DEFAULT_USER_PERMISSIONS: UserPermissions = {
  userId: "user-default",
  systemFeatures: {
    societies: READ_WRITE_CRUD,
    shareholders: READ_ONLY_CRUD,
    directory: READ_ONLY_CRUD,
    juntas: READ_ONLY_CRUD,
    chatAI: false,
    userManagement: false,
  },
  repositoryAccess: {
    fullAccess: false,
    permissions: {
      view: true,
      download: false, // DLP: No puede descargar
      upload: true,
      delete: false,
      search: true,
    },
  },
};

/**
 * Permisos por defecto para Usuario Viewer (Solo Lectura)
 */
export const DEFAULT_VIEWER_PERMISSIONS: UserPermissions = {
  userId: "viewer-default",
  systemFeatures: {
    societies: READ_ONLY_CRUD,
    shareholders: READ_ONLY_CRUD,
    directory: READ_ONLY_CRUD,
    juntas: READ_ONLY_CRUD,
    chatAI: false,
    userManagement: false,
  },
  repositoryAccess: {
    fullAccess: false,
    permissions: {
      view: true,
      download: false,
      upload: false,
      delete: false,
      search: true,
    },
  },
};

/**
 * Features por defecto para Workspace
 */
export const DEFAULT_WORKSPACE_FEATURES: WorkspaceFeatures = {
  hasChatAI: true,
  allowDownloads: true,
  allowComments: true,
  showFlowsPreview: true,
};

/**
 * Obtener permisos por defecto según rol
 */
export function getDefaultPermissionsByRole(roleId: string): UserPermissions {
  switch (roleId) {
    case "admin":
      return DEFAULT_ADMIN_PERMISSIONS;
    case "user":
      return DEFAULT_USER_PERMISSIONS;
    case "viewer":
      return DEFAULT_VIEWER_PERMISSIONS;
    default:
      // Por defecto, dar permisos mínimos
      return DEFAULT_VIEWER_PERMISSIONS;
  }
}

/**
 * Verificar si un usuario tiene permisos de admin
 */
export function isAdminPermissions(permissions: UserPermissions): boolean {
  return (
    permissions.systemFeatures.userManagement === true &&
    permissions.repositoryAccess.fullAccess === true
  );
}


