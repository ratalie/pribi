/**
 * Tipos de Módulos del Sistema
 * 
 * Define los módulos disponibles y sus acciones específicas
 * Basado en el alcance final definido
 */

/**
 * Acciones disponibles por módulo
 */
export type ModuleAction = "dashboard" | "crear" | "historial";

/**
 * Módulos principales del sistema
 */
export enum SystemModule {
  SOCIEDADES = "sociedades",
  SUCURSALES = "sucursales",
  JUNTA_ACCIONISTAS = "junta-accionistas",
  DIRECTORIO = "directorio",
  REPOSITORIO_ALMACEN = "repositorio.almacen",
  REPOSITORIO_DOCUMENTOS = "repositorio.documentos",
  CHAT_IA = "chat-ia",
  ESPACIOS_TRABAJO = "espacios-trabajo",
}

/**
 * Permisos granulares por módulo
 */
export interface ModulePermissions {
  dashboard: boolean;
  crear: boolean;
  historial: boolean;
}

/**
 * Permisos completos del sistema
 */
export interface SystemModulePermissions {
  sociedades: ModulePermissions;
  sucursales: ModulePermissions;
  "junta-accionistas": ModulePermissions;
  directorio: ModulePermissions;
  "repositorio.almacen": {
    view: boolean;
    download: boolean;
    upload: boolean;
    delete: boolean;
  };
  "repositorio.documentos": {
    view: boolean;
    download: boolean;
  };
  "chat-ia": {
    iniciar_chat: boolean;
  };
  "espacios-trabajo": ModulePermissions;
}

/**
 * Mapeo de rutas a módulos y acciones
 */
export const ROUTE_TO_MODULE_ACTION: Record<string, { module: SystemModule; action: ModuleAction }> = {
  // Sociedades
  "/registros/sociedades/dashboard": { module: SystemModule.SOCIEDADES, action: "dashboard" },
  "/registros/sociedades/agregar": { module: SystemModule.SOCIEDADES, action: "crear" },
  "/registros/sociedades/historial": { module: SystemModule.SOCIEDADES, action: "historial" },
  
  // Sucursales
  "/registros/sucursales/dashboard": { module: SystemModule.SUCURSALES, action: "dashboard" },
  "/registros/sucursales/agregar": { module: SystemModule.SUCURSALES, action: "crear" },
  "/registros/sucursales/historial": { module: SystemModule.SUCURSALES, action: "historial" },
  
  // Junta de Accionistas
  "/operaciones/junta-accionistas/dashboard": { module: SystemModule.JUNTA_ACCIONISTAS, action: "dashboard" },
  "/operaciones/junta-accionistas/crear": { module: SystemModule.JUNTA_ACCIONISTAS, action: "crear" },
  "/operaciones/junta-accionistas/historico": { module: SystemModule.JUNTA_ACCIONISTAS, action: "historial" },
  
  // Directorio
  "/operaciones/directorio/dashboard": { module: SystemModule.DIRECTORIO, action: "dashboard" },
  "/operaciones/directorio/crear": { module: SystemModule.DIRECTORIO, action: "crear" },
  "/operaciones/directorio/historico": { module: SystemModule.DIRECTORIO, action: "historial" },
  
  // Repositorio
  "/storage/almacen": { module: SystemModule.REPOSITORIO_ALMACEN, action: "dashboard" },
  "/storage/documentos-generados": { module: SystemModule.REPOSITORIO_DOCUMENTOS, action: "dashboard" },
  
  // Chat IA (módulo principal, NO features)
  "/chat-ia": { module: SystemModule.CHAT_IA, action: "dashboard" },
  
  // Espacios de Trabajo (módulo principal, NO features)
  "/espacios-trabajo/dashboard": { module: SystemModule.ESPACIOS_TRABAJO, action: "dashboard" },
  "/espacios-trabajo/crear": { module: SystemModule.ESPACIOS_TRABAJO, action: "crear" },
  "/espacios-trabajo/espacios": { module: SystemModule.ESPACIOS_TRABAJO, action: "historial" },
};

/**
 * Obtener módulo y acción desde una ruta
 */
export function getModuleActionFromRoute(route: string): { module: SystemModule; action: ModuleAction } | null {
  // Buscar coincidencia exacta
  if (ROUTE_TO_MODULE_ACTION[route]) {
    return ROUTE_TO_MODULE_ACTION[route];
  }
  
  // Buscar coincidencia parcial (para rutas con parámetros)
  for (const [pattern, value] of Object.entries(ROUTE_TO_MODULE_ACTION)) {
    if (route.startsWith(pattern)) {
      return value;
    }
  }
  
  return null;
}

