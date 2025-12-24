import type { SimplePermissionsConfig } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
import type { AccessAreaEnum } from "~/core/hexag/permissions/domain/enums/access-area.enum";
import { FlowCodeEnum } from "~/core/hexag/permissions/domain/enums/flow-code.enum";
import {
  PermissionActionEnum,
  FrontendToBackendActionMap,
} from "~/core/hexag/permissions/domain/enums/permission-action.enum";

/**
 * Mapeo de áreas a códigos de flujo
 * Cada área puede tener múltiples flujos, pero para simplificar usamos el flujo principal
 */
const AREA_TO_FLOW_MAP: Record<AccessAreaEnum, FlowCodeEnum> = {
  REGISTROS: FlowCodeEnum.SOCIETY_PROFILE,
  OPERACIONES: FlowCodeEnum.SHARED_FLOW, // Las operaciones usan flujos compartidos
  REPOSITORIO_AI: FlowCodeEnum.ARCHIVES,
  SUNAT: FlowCodeEnum.SUNAT,
  ARCHIVES: FlowCodeEnum.ARCHIVES,
};

/**
 * Mapeo de áreas a módulos principales
 * Para simplificar, cada área tiene un módulo principal
 * Estos deben coincidir con ModuleAccess enum del backend
 *
 * NOTA: El backend acepta strings que coincidan con ModuleAccess enum
 */
const AREA_TO_MODULE_MAP: Record<AccessAreaEnum, string> = {
  REGISTROS: "SOCIETY", // Módulo principal de REGISTROS (Society Profile)
  OPERACIONES: "MEETING_TYPE", // Módulo principal de OPERACIONES (juntas)
  REPOSITORIO_AI: "ARCHIVES", // Repositorio AI usa ARCHIVES
  SUNAT: "SUNAT",
  ARCHIVES: "ARCHIVES",
};

/**
 * Estructura de override que espera el backend
 * Basado en UpsertUserOverrideDto del backend
 */
interface BackendOverride {
  area?: string;
  module?: string;
  flow?: string;
  status?: boolean;
  actions?: Array<{
    action: string;
    status: boolean;
    isOverride?: boolean;
  }>;
  route?: string;
  routes?: Array<{
    key: string;
    status?: boolean;
    actions?: Array<{
      action: string;
      status: boolean;
    }>;
    modules?: Array<{
      module: string;
      status?: boolean;
      actions?: Array<{
        action: string;
        status: boolean;
        isOverride?: boolean;
      }>;
    }>;
  }>;
}

/**
 * Convierte configuración simple de permisos a overrides del backend
 *
 * Lógica:
 * 1. Si es Administrador → No generar overrides
 * 2. Si es Editor/Lector:
 *    - Módulos deshabilitados → Bloquear área completa
 *    - Acciones deshabilitadas → Quitar permisos específicos
 *    - Sociedades limitadas → Se maneja en otro endpoint
 */
export function mapSimpleConfigToOverrides(
  config: SimplePermissionsConfig
): BackendOverride[] | null {
  // Si es Administrador, no hay overrides
  if (config.role === "Administrador") {
    return null;
  }

  const overrides: BackendOverride[] = [];

  // 1. Procesar módulos deshabilitados (bloquear áreas completas)
  const disabledModules = config.modules.filter((m) => !m.enabled);

  for (const module of disabledModules) {
    const area = module.area as AccessAreaEnum;
    const flowCode = AREA_TO_FLOW_MAP[area];
    const moduleName = AREA_TO_MODULE_MAP[area];

    if (flowCode && moduleName) {
      // Bloquear toda el área usando AreaRouteOverrideSchema
      overrides.push({
        area,
        status: false, // Deshabilitar toda el área
      });
    }
  }

  // 2. Procesar acciones deshabilitadas (solo para Editor)
  if (config.role === "Editor") {
    const disabledActions: string[] = [];

    // Identificar acciones deshabilitadas
    if (!config.actions.view) disabledActions.push("view");
    if (!config.actions.create) disabledActions.push("create");
    if (!config.actions.update) disabledActions.push("update");
    if (!config.actions.delete) disabledActions.push("delete");
    if (!config.actions.file) disabledActions.push("file");

    // Si hay acciones deshabilitadas, quitar permisos en todos los módulos habilitados
    if (disabledActions.length > 0) {
      const enabledModules = config.modules.filter((m) => m.enabled);

      for (const module of enabledModules) {
        const area = module.area as AccessAreaEnum;
        const flowCode = AREA_TO_FLOW_MAP[area];
        const moduleName = AREA_TO_MODULE_MAP[area];

        if (flowCode && moduleName) {
          // Quitar acciones específicas usando ModuleOverrideSchema
          const actionOverrides = disabledActions.map((action) => {
            // El backend acepta tanto 'view' como 'read', etc.
            // Usamos el formato del frontend directamente
            return {
              action, // El backend acepta 'view', 'create', etc.
              status: false, // Deshabilitar
              isOverride: true, // Es un override negativo (quitar permiso)
            };
          });

          overrides.push({
            module: moduleName,
            flow: flowCode,
            actions: actionOverrides,
          });
        }
      }
    }
  }

  // 3. Si es Lector, asegurar que solo tenga 'view'
  if (config.role === "Lector") {
    const enabledModules = config.modules.filter((m) => m.enabled);
    const actionsToDisable = ["create", "update", "delete", "file"];

    for (const module of enabledModules) {
      const area = module.area as AccessAreaEnum;
      const flowCode = AREA_TO_FLOW_MAP[area];
      const moduleName = AREA_TO_MODULE_MAP[area];

      if (flowCode && moduleName) {
        const actionOverrides = actionsToDisable.map((action) => {
          return {
            action, // El backend acepta 'view', 'create', etc.
            status: false,
            isOverride: true,
          };
        });

        overrides.push({
          module: moduleName,
          flow: flowCode,
          actions: actionOverrides,
        });
      }
    }
  }

  // Si no hay overrides, retornar null
  return overrides.length > 0 ? overrides : null;
}
