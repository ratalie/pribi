/**
 * Tipos de Permisos
 * 
 * Basado en Admin Panel de Figma
 * Define la estructura completa de permisos del sistema
 */

/**
 * Permisos CRUD (Create, Read, Update, Delete)
 */
export interface CRUD {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

/**
 * Permisos del Sistema (System Features)
 * 
 * Define qué módulos y funcionalidades puede usar el usuario
 */
export interface SystemFeatures {
  societies: CRUD;
  shareholders: CRUD;
  directory: CRUD;
  juntas: CRUD;
  chatAI: boolean;
  userManagement: boolean;
}

/**
 * Permisos de Acceso al Repositorio
 * 
 * Define qué puede hacer el usuario con archivos y documentos
 */
export interface RepositoryAccess {
  fullAccess: boolean; // Si es true, tiene todos los permisos
  permissions: {
    view: boolean;
    download: boolean; // DLP: Data Loss Prevention
    upload: boolean;
    delete: boolean;
    search: boolean;
  };
}

/**
 * Permisos Completos del Usuario
 * 
 * Esta es la estructura principal que viene del backend
 */
export interface UserPermissions {
  userId: string;
  systemFeatures: SystemFeatures;
  repositoryAccess: RepositoryAccess;
}

/**
 * Features de Workspace
 * 
 * Configuración de funcionalidades por workspace
 */
export interface WorkspaceFeatures {
  hasChatAI: boolean; // ¿Puede usar AI en este workspace?
  allowDownloads: boolean; // ¿Puede descargar archivos?
  allowComments: boolean; // ¿Puede comentar?
  showFlowsPreview: boolean; // ¿Muestra preview de flujos legales?
}

/**
 * Permisos de Usuario en Workspace
 * 
 * Permisos específicos dentro de un workspace
 */
export interface WorkspaceUserPermissions {
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
  permissions: {
    view: boolean;
    download: boolean;
    upload: boolean;
    delete: boolean;
    invite: boolean; // ¿Puede invitar miembros?
    manageMembers: boolean; // ¿Puede gestionar miembros?
  };
}

/**
 * Helper: Verificar si tiene permiso CRUD específico
 */
export function hasCRUDPermission(
  crud: CRUD,
  action: "create" | "read" | "update" | "delete"
): boolean {
  return crud[action] === true;
}

/**
 * Helper: Verificar si tiene todos los permisos CRUD
 */
export function hasFullCRUD(crud: CRUD): boolean {
  return crud.create && crud.read && crud.update && crud.delete;
}

/**
 * Helper: Verificar si tiene solo lectura
 */
export function isReadOnly(crud: CRUD): boolean {
  return crud.read && !crud.create && !crud.update && !crud.delete;
}


