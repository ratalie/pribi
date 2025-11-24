/**
 * Mapper de Permisos: Backend → Frontend
 * 
 * Convierte la estructura de permisos del backend (accessMap)
 * a la estructura del frontend (UserPermissions)
 * 
 * Backend estructura:
 * {
 *   code: "SOCIETY_PROFILE",
 *   modules: [
 *     { name: "SOCIETY", actions: ["read", "write"] }
 *   ]
 * }[]
 * 
 * Frontend estructura:
 * {
 *   systemFeatures: {
 *     societies: { create: true, read: true, update: true, delete: false }
 *   }
 * }
 */

import type { UserPermissions, CRUD } from "~/types/permissions";

/**
 * Estructura de permisos que viene del backend
 */
export interface BackendAccessMap {
  code: string;
  modules: {
    name: string; // ModuleAccess enum (SOCIETY, SHAREHOLDER, etc.)
    actions: string[]; // ["read", "write", "delete", etc.]
  }[];
}

/**
 * Mapeo de módulos del backend a módulos del frontend
 */
const MODULE_MAPPING: Record<string, keyof UserPermissions["systemFeatures"]> = {
  SOCIETY: "societies",
  SHAREHOLDER: "shareholders",
  BOARD_OF_DIRECTORS: "directory",
  ARCHIVES: "repositorio", // Para sucursales y repositorio
  MEETING_TYPE: "juntas", // Para juntas de accionistas
  MEETING_DETAILS: "juntas", // Para juntas de accionistas
  // Nuevos módulos (cuando backend los agregue)
  // SUCURSALES: "sucursales",
  // JUNTA_ACCIONISTAS: "juntas",
  // WORKSPACES: "workspaces",
  // CHAT_IA: "chatAI",
};

/**
 * Mapeo de acciones del backend a acciones del frontend
 * 
 * Backend puede usar:
 * - Acciones genéricas: "read", "write", "delete"
 * - Acciones específicas: "SOCIETY_DASHBOARD", "SOCIETY_CREAR", "SOCIETY_HISTORIAL"
 */
const ACTION_MAPPING: Record<string, keyof CRUD> = {
  read: "read",
  write: "write", // write = create + update
  create: "create",
  update: "update",
  delete: "delete",
  // Acciones específicas (cuando backend las agregue)
  society_dashboard: "read",
  society_crear: "create",
  society_historial: "read",
  sucursales_dashboard: "read",
  sucursales_crear: "create",
  sucursales_historial: "read",
  junta_dashboard: "read",
  junta_crear: "create",
  junta_historial: "read",
  directorio_dashboard: "read",
  directorio_crear: "create",
  directorio_historial: "read",
};

/**
 * Mapeo de acciones específicas a acciones frontend
 * 
 * Si backend usa acciones específicas (ej: SOCIETY_DASHBOARD),
 * las mapeamos a acciones frontend (dashboard, crear, historial)
 */
const SPECIFIC_ACTION_MAPPING: Record<string, { action: "dashboard" | "crear" | "historial"; crud: Partial<CRUD> }> = {
  // Sociedades
  "society_dashboard": { action: "dashboard", crud: { read: true } },
  "society_crear": { action: "crear", crud: { create: true } },
  "society_historial": { action: "historial", crud: { read: true } },
  
  // Sucursales
  "sucursales_dashboard": { action: "dashboard", crud: { read: true } },
  "sucursales_crear": { action: "crear", crud: { create: true } },
  "sucursales_historial": { action: "historial", crud: { read: true } },
  
  // Juntas
  "junta_accionistas_dashboard": { action: "dashboard", crud: { read: true } },
  "junta_accionistas_crear": { action: "crear", crud: { create: true } },
  "junta_accionistas_historial": { action: "historial", crud: { read: true } },
  
  // Directorio
  "board_of_directors_dashboard": { action: "dashboard", crud: { read: true } },
  "board_of_directors_crear": { action: "crear", crud: { create: true } },
  "board_of_directors_historial": { action: "historial", crud: { read: true } },
};

/**
 * Convertir acciones del backend a CRUD del frontend
 * 
 * Soporta dos modos:
 * 1. Acciones genéricas: "read", "write", "delete"
 * 2. Acciones específicas: "SOCIETY_DASHBOARD", "SOCIETY_CREAR", etc.
 */
function mapActionsToCRUD(actions: string[]): CRUD {
  const crud: CRUD = {
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  actions.forEach((action) => {
    const normalizedAction = action.toLowerCase().replace(/-/g, "_");
    
    // Verificar si es acción específica
    const specificMapping = SPECIFIC_ACTION_MAPPING[normalizedAction];
    if (specificMapping) {
      // Es acción específica, aplicar mapeo
      Object.assign(crud, specificMapping.crud);
      return;
    }
    
    // Mapeo genérico (fallback)
    if (normalizedAction === "read") {
      crud.read = true;
    } else if (normalizedAction === "create") {
      crud.create = true;
    } else if (normalizedAction === "update") {
      crud.update = true;
    } else if (normalizedAction === "delete") {
      crud.delete = true;
    } else if (normalizedAction === "write") {
      // write = create + update
      crud.create = true;
      crud.update = true;
    }
  });

  return crud;
}

/**
 * Mapear accessMap del backend a UserPermissions del frontend
 * 
 * @param accessMap - Estructura de permisos del backend
 * @param userId - ID del usuario
 * @returns UserPermissions del frontend
 */
export function mapBackendAccessMapToUserPermissions(
  accessMap: BackendAccessMap[],
  userId: string
): UserPermissions {
  // Inicializar permisos por defecto (todo en false)
  const permissions: UserPermissions = {
    userId,
    systemFeatures: {
      societies: { create: false, read: false, update: false, delete: false },
      shareholders: { create: false, read: false, update: false, delete: false },
      directory: { create: false, read: false, update: false, delete: false },
      juntas: { create: false, read: false, update: false, delete: false },
      chatAI: false,
      userManagement: false,
    },
    repositoryAccess: {
      fullAccess: false,
      permissions: {
        view: false,
        download: false,
        upload: false,
        delete: false,
        search: false,
      },
    },
  };

  // Procesar cada flow del accessMap
  accessMap.forEach((flow) => {
    flow.modules.forEach((module) => {
      const frontendModule = MODULE_MAPPING[module.name];
      
      if (frontendModule) {
        const crud = mapActionsToCRUD(module.actions);
        
        // Si el módulo ya tiene permisos, combinarlos (OR lógico)
        const existingCRUD = permissions.systemFeatures[frontendModule];
        permissions.systemFeatures[frontendModule] = {
          create: existingCRUD.create || crud.create,
          read: existingCRUD.read || crud.read,
          update: existingCRUD.update || crud.update,
          delete: existingCRUD.delete || crud.delete,
        };
      }
    });
  });

  // Si tiene permisos de SOCIETY con write, probablemente es admin
  // TODO: Mejorar esta lógica cuando backend devuelva rol explícito
  if (
    permissions.systemFeatures.societies.create &&
    permissions.systemFeatures.societies.update &&
    permissions.systemFeatures.societies.delete
  ) {
    // Probablemente admin, dar permisos adicionales
    permissions.systemFeatures.userManagement = true;
    permissions.repositoryAccess.fullAccess = true;
    permissions.repositoryAccess.permissions = {
      view: true,
      download: true,
      upload: true,
      delete: true,
      search: true,
    };
  } else {
    // Usuario estándar: permisos básicos de repositorio
    permissions.repositoryAccess.permissions.view = true;
    permissions.repositoryAccess.permissions.search = true;
    
    // Si tiene write en algún módulo, puede subir
    const hasWrite = Object.values(permissions.systemFeatures).some(
      (feature) => typeof feature === "object" && (feature.create || feature.update)
    );
    if (hasWrite) {
      permissions.repositoryAccess.permissions.upload = true;
    }
  }

  return permissions;
}

/**
 * Verificar si un usuario tiene permiso específico desde accessMap
 */
export function hasPermissionInAccessMap(
  accessMap: BackendAccessMap[],
  module: string,
  action: string
): boolean {
  return accessMap.some((flow) =>
    flow.modules.some(
      (m) => m.name === module && m.actions.includes(action.toLowerCase())
    )
  );
}

