/**
 * Composable de Permisos con Modo Degradado
 * 
 * Si MSW_ROLES_PERMISOS_DISABLED=true o no hay permisos,
 * funciona en modo degradado (permite todo)
 * 
 * Esto asegura que el equipo trabajando en registro de sociedades
 * NO se vea bloqueado por el sistema de permisos
 */

import { computed, ref } from "vue";
import type { UserPermissions } from "~/types/permissions";

/**
 * Composable de Permisos con Modo Degradado
 * 
 * Características:
 * - Si MSW_ROLES_PERMISOS_DISABLED=true → Modo degradado (permite todo)
 * - Si no hay permisos → Modo degradado (permite todo)
 * - Si hay permisos → Verifica normalmente
 */
export const usePermissions = () => {
  const config = useRuntimeConfig();
  const permissionsDisabled = config.public?.mswRolesPermisosDisabled === true;
  
  // TODO: Obtener permisos del store cuando esté listo
  const permissions = ref<UserPermissions | null>(null);
  
  /**
   * Verificar si está en modo degradado
   */
  const isDegradedMode = computed(() => {
    return permissionsDisabled || !permissions.value;
  });
  
  /**
   * Verificar si tiene permiso en modo degradado
   * Si no hay permisos o están deshabilitados, permite todo
   */
  const hasPermission = (
    module: string,
    action: "create" | "read" | "update" | "delete"
  ): boolean => {
    // Modo degradado: permite todo
    if (isDegradedMode.value) {
      if (import.meta.dev) {
        console.debug(`[usePermissions] Modo degradado: permitiendo ${module}.${action}`);
      }
      return true;
    }
    
    // Verificar permiso real
    const modulePerms = permissions.value?.systemFeatures[module as keyof typeof permissions.value.systemFeatures];
    if (typeof modulePerms === "object" && modulePerms !== null) {
      return modulePerms[action] === true;
    }
    
    return false;
  };
  
  /**
   * Verificar si puede descargar (DLP)
   */
  const canDownload = computed(() => {
    if (isDegradedMode.value) {
      return true; // Modo degradado
    }
    return permissions.value?.repositoryAccess.permissions.download ?? false;
  });
  
  /**
   * Verificar si puede ver un módulo
   */
  const canViewModule = (moduleId: string): boolean => {
    if (isDegradedMode.value) {
      return true; // Modo degradado
    }
    
    // Verificar si tiene al menos permiso de lectura
    return hasPermission(moduleId, "read");
  };
  
  /**
   * Verificar si tiene acceso completo a un módulo (CRUD completo)
   */
  const hasFullAccess = (module: string): boolean => {
    if (isDegradedMode.value) {
      return true; // Modo degradado
    }
    
    const modulePerms = permissions.value?.systemFeatures[module as keyof typeof permissions.value.systemFeatures];
    if (typeof modulePerms === "object" && modulePerms !== null) {
      return (
        modulePerms.create &&
        modulePerms.read &&
        modulePerms.update &&
        modulePerms.delete
      );
    }
    
    return false;
  };
  
  return {
    hasPermission,
    canDownload,
    canViewModule,
    hasFullAccess,
    isDegradedMode,
    permissions: readonly(permissions),
  };
};


