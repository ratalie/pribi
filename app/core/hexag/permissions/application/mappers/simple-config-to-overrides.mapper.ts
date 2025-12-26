import type { SimplePermissionsConfig } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
import type { AccessAreaEnum } from "~/core/hexag/permissions/domain/enums/access-area.enum";
import { FlowCodeEnum } from "~/core/hexag/permissions/domain/enums/flow-code.enum";

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
  // Si es Administrador o Administrador Superior, no hay overrides
  if (config.role === "Administrador" || config.role === "Administrador Superior") {
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

  // 2. Procesar acciones para Editor
  // El rol "Usuario" (Editor) en el backend solo tiene READ, WRITE, FILE por defecto
  // NO tiene UPDATE ni DELETE por defecto
  if (config.role === "Editor") {
    console.log("[mapSimpleConfigToOverrides] Procesando acciones para Editor");
    console.log("[mapSimpleConfigToOverrides] Acciones en config:", config.actions);

    const enabledModules = config.modules.filter((m) => m.enabled);

    // Permisos por defecto del rol Editor en el backend
    // userActions = [READ, WRITE, FILE] → En frontend: view, create, file
    const defaultEditorActions = {
      view: true, // READ
      create: true, // WRITE
      update: false, // NO está en userActions
      delete: false, // NO está en userActions
      file: true, // FILE
    };

    console.log(
      "[mapSimpleConfigToOverrides] Acciones por defecto del rol Editor:",
      defaultEditorActions
    );

    // Identificar acciones que necesitan override
    const actionsToOverride: Array<{ action: string; status: boolean }> = [];

    // Si update está habilitado pero no está en defaults → Habilitar con override
    if (config.actions.update && !defaultEditorActions.update) {
      console.log(
        "[mapSimpleConfigToOverrides] update está habilitado pero no está en defaults → Agregando override para habilitar"
      );
      actionsToOverride.push({ action: "update", status: true });
    }

    // Si delete está habilitado pero no está en defaults → Habilitar con override
    if (config.actions.delete && !defaultEditorActions.delete) {
      console.log(
        "[mapSimpleConfigToOverrides] delete está habilitado pero no está en defaults → Agregando override para habilitar"
      );
      actionsToOverride.push({ action: "delete", status: true });
    }

    // Si file está deshabilitado pero está en defaults → Deshabilitar con override
    if (!config.actions.file && defaultEditorActions.file) {
      console.log(
        "[mapSimpleConfigToOverrides] file está deshabilitado pero está en defaults → Agregando override para deshabilitar"
      );
      actionsToOverride.push({ action: "file", status: false });
    }

    // Si view está deshabilitado → Deshabilitar con override (aunque no debería pasar)
    if (!config.actions.view) {
      console.log(
        "[mapSimpleConfigToOverrides] view está deshabilitado → Agregando override para deshabilitar"
      );
      actionsToOverride.push({ action: "view", status: false });
    }

    // Si create está deshabilitado → Deshabilitar con override (aunque no debería pasar)
    if (!config.actions.create) {
      console.log(
        "[mapSimpleConfigToOverrides] create está deshabilitado → Agregando override para deshabilitar"
      );
      actionsToOverride.push({ action: "create", status: false });
    }

    console.log(
      "[mapSimpleConfigToOverrides] Acciones que necesitan override:",
      actionsToOverride
    );

    // Si hay acciones que necesitan override, aplicarlas a todos los módulos habilitados
    if (actionsToOverride.length > 0) {
      for (const module of enabledModules) {
        const area = module.area as AccessAreaEnum;
        const flowCode = AREA_TO_FLOW_MAP[area];
        const moduleName = AREA_TO_MODULE_MAP[area];

        if (flowCode && moduleName) {
          const actionOverrides = actionsToOverride.map(({ action, status }) => ({
            action,
            status,
            isOverride: true,
          }));

          console.log(
            "[mapSimpleConfigToOverrides] Agregando override para módulo:",
            moduleName,
            "con acciones:",
            actionOverrides
          );

          overrides.push({
            module: moduleName,
            flow: flowCode,
            actions: actionOverrides,
          });
        }
      }
    } else {
      console.log("[mapSimpleConfigToOverrides] No hay acciones que necesiten override");
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
