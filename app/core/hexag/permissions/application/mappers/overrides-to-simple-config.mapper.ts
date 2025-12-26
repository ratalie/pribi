import type {
  SimplePermissionsConfig,
  SubModuleConfig,
} from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
import type { AccessArea } from "~/core/hexag/permissions/domain/entities/access-area.entity";
import type { AccessAreaEnum } from "~/core/hexag/permissions/domain/enums/access-area.enum";
import { AVAILABLE_AREAS } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
import {
  getSubmodulesForArea,
  createSubmoduleConfigFromDefinition,
} from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/utils/submodule-definitions.utils";

/**
 * Convierte los permisos del backend (AccessArea[]) a configuración simple
 *
 * Esta función analiza los permisos efectivos del usuario y genera una configuración simple
 * que puede ser editada en la UI.
 *
 * NOTA: Esta es una función de inferencia, puede no ser 100% precisa.
 * Se recomienda usar solo como punto de partida para editar.
 */
export function mapOverridesToSimpleConfig(
  accessAreas: AccessArea[],
  currentRole: "Administrador" | "AdministradorEstudio" | "Usuario" | "Lector" | "Externo"
): SimplePermissionsConfig {
  console.log('[mapOverridesToSimpleConfig] INICIO - Datos recibidos del backend:');
  console.log('[mapOverridesToSimpleConfig] accessAreas:', JSON.stringify(accessAreas, null, 2));
  console.log('[mapOverridesToSimpleConfig] currentRole:', currentRole);

  // Determinar rol simple
  let simpleRole: "Administrador Superior" | "Administrador" | "Editor" | "Lector" | "Externo" = "Editor";
  if (currentRole === "AdministradorEstudio") {
    simpleRole = "Administrador Superior";
  } else if (currentRole === "Administrador" || currentRole === "SuperAdministrador") {
    simpleRole = "Administrador";
  } else if (currentRole === "Usuario") {
    simpleRole = "Editor"; // Usuario del backend = Editor en frontend
  } else if (currentRole === "Lector") {
    simpleRole = "Lector";
  } else if (currentRole === "Externo") {
    simpleRole = "Externo";
  }
  
  console.log('[mapOverridesToSimpleConfig] currentRole recibido:', currentRole);
  console.log('[mapOverridesToSimpleConfig] simpleRole determinado:', simpleRole);

  console.log('[mapOverridesToSimpleConfig] Rol simple determinado:', simpleRole);

  // Si es Administrador o Administrador Superior, retornar configuración por defecto
  if (simpleRole === "Administrador" || simpleRole === "Administrador Superior") {
    console.log('[mapOverridesToSimpleConfig] Es Administrador o Administrador Superior, retornando configuración por defecto');
    // Si es Administrador o Administrador Superior, inicializar con todos los sub-módulos habilitados
    const adminModules = AVAILABLE_AREAS.map((area) => {
      const definitions = getSubmodulesForArea(area);
      const submodules = definitions.map((def) =>
        createSubmoduleConfigFromDefinition(def, true)
      );
      return {
        area,
        enabled: true,
        submodules,
      };
    });

    return {
      role: simpleRole,
      modules: adminModules,
      societies: {
        mode: "all",
        ids: [],
      },
      actions: {
        view: true,
        create: true,
        update: true,
        delete: true,
        file: true,
      },
    };
  }

  // Mapear módulos habilitados
  // Un área está habilitada si tiene al menos una ruta con status: true
  const enabledAreas = new Set<AccessAreaEnum>();
  for (const area of accessAreas) {
    // Verificar si el área tiene status: true o si tiene rutas habilitadas
    const areaEnabled = area.status !== false; // Por defecto true si no está definido

    if (areaEnabled && area.routes && area.routes.length > 0) {
      // Verificar si hay al menos una ruta habilitada
      const hasEnabledRoute = area.routes.some(
        (route) => route.status !== false && (route.actions?.length > 0 || route.modules?.length > 0)
      );

      if (hasEnabledRoute) {
        enabledAreas.add(area.area);
        console.log('[mapOverridesToSimpleConfig] Área habilitada:', area.area);
      }
    }
  }

  // Mapear módulos con sub-módulos inferidos
  const modules = AVAILABLE_AREAS.map((area) => {
    const areaData = accessAreas.find((a) => a.area === (area as AccessAreaEnum));
    const isEnabled = enabledAreas.has(area as AccessAreaEnum);

    // Obtener definiciones de sub-módulos para esta área
    const definitions = getSubmodulesForArea(area);

    // Inferir sub-módulos desde permisos del backend
    const submodules: SubModuleConfig[] = definitions.map((def) => {
      const inferredConfig = inferSubmoduleFromBackend(
        areaData,
        def,
        isEnabled
      );
      return inferredConfig;
    });

    return {
      area,
      enabled: isEnabled,
      submodules,
    };
  });

  console.log('[mapOverridesToSimpleConfig] Módulos mapeados:', modules);

  // Determinar acciones permitidas
  // Analizar las rutas para ver qué acciones están disponibles y habilitadas
  const availableActions = new Set<string>();

  for (const area of accessAreas) {
    // Solo procesar áreas habilitadas
    if (area.status === false) continue;

    for (const route of area.routes || []) {
      // Solo procesar rutas habilitadas
      if (route.status === false) continue;

      // Revisar acciones en la ruta
      // El backend puede devolver acciones como array de strings ["view", "create"] 
      // o como array de objetos { action: "view", status: true }
      if (Array.isArray(route.actions)) {
        for (const action of route.actions) {
          if (typeof action === 'string') {
            // Es un string directo: "view", "create", etc.
            availableActions.add(action);
            console.log('[mapOverridesToSimpleConfig] Acción encontrada en ruta (string):', action);
          } else if (typeof action === 'object' && action !== null) {
            // Es un objeto: { action: "view", status: true, enabled: true }
            const actionEnabled = (action as any).enabled !== false && (action as any).status !== false;
            if (actionEnabled && (action as any).action) {
              availableActions.add((action as any).action);
              console.log('[mapOverridesToSimpleConfig] Acción encontrada en ruta (objeto):', (action as any).action);
            }
          }
        }
      }

      // También revisar acciones en módulos dentro de rutas
      for (const module of route.modules || []) {
        if (module.status === false) continue;

        if (Array.isArray(module.actions)) {
          for (const action of module.actions) {
            if (typeof action === 'string') {
              // Es un string directo: "view", "create", etc.
              availableActions.add(action);
              console.log('[mapOverridesToSimpleConfig] Acción encontrada en módulo (string):', action);
            } else if (typeof action === 'object' && action !== null) {
              // Es un objeto: { action: "view", status: true, enabled: true }
              const actionEnabled = (action as any).enabled !== false && (action as any).status !== false;
              if (actionEnabled && (action as any).action) {
                availableActions.add((action as any).action);
                console.log('[mapOverridesToSimpleConfig] Acción encontrada en módulo (objeto):', (action as any).action);
              }
            }
          }
        }
      }
    }
  }

  console.log('[mapOverridesToSimpleConfig] Acciones disponibles encontradas:', Array.from(availableActions));

  // Mapear acciones (el backend puede usar 'read'/'write' o 'view'/'create')
  const actions = {
    view: availableActions.has("view") || availableActions.has("read"),
    create: availableActions.has("create") || availableActions.has("write"),
    update: availableActions.has("update"),
    delete: availableActions.has("delete"),
    file: availableActions.has("file"),
  };

  console.log('[mapOverridesToSimpleConfig] Acciones mapeadas:', actions);

  // Si es Lector, forzar solo 'view'
  if (simpleRole === "Lector") {
    actions.create = false;
    actions.update = false;
    actions.delete = false;
    actions.file = false;
  }

  const result = {
    role: simpleRole,
    modules,
    societies: {
      mode: "all", // Por defecto, se asume todas (esto se carga por separado)
      ids: [],
    },
    actions,
  };

  console.log('[mapOverridesToSimpleConfig] RESULTADO FINAL:', JSON.stringify(result, null, 2));

  return result;
}

/**
 * Infiere la configuración de un sub-módulo desde los permisos del backend
 */
function inferSubmoduleFromBackend(
  areaData: AccessArea | undefined,
  definition: {
    key: string;
    displayName: string;
    description?: string;
    backendModules: string[];
    defaultActions: SubModuleConfig["actions"];
  },
  areaEnabled: boolean
): SubModuleConfig {
  // Si el área no está habilitada o no hay datos, retornar deshabilitado
  if (!areaEnabled || !areaData) {
    return createSubmoduleConfigFromDefinition(definition, false);
  }

  // Verificar si al menos uno de los módulos del backend está habilitado
  let hasEnabledModule = false;
  const moduleStatuses = new Map<string, boolean>();

  for (const backendModule of definition.backendModules) {
    // Buscar en las rutas si este módulo tiene permisos
    const moduleEnabled = areaData.routes.some((route) => {
      if (route.status === false) return false;

      // Buscar en módulos de la ruta
      const moduleInRoute = route.modules?.find(
        (m) => m.module === backendModule && m.status !== false
      );

      if (moduleInRoute) {
        // Verificar si tiene acciones habilitadas
        const hasActions =
          (moduleInRoute.actions?.length ?? 0) > 0 ||
          (route.actions?.length ?? 0) > 0;
        return hasActions;
      }

      // Si no hay módulos específicos, verificar acciones a nivel de ruta
      if ((route.actions?.length ?? 0) > 0) {
        return true;
      }

      return false;
    });

    moduleStatuses.set(backendModule, moduleEnabled);
    if (moduleEnabled) {
      hasEnabledModule = true;
    }
  }

  // Si ningún módulo está habilitado, retornar deshabilitado
  if (!hasEnabledModule) {
    return createSubmoduleConfigFromDefinition(definition, false);
  }

  // Inferir acciones desde los permisos del backend
  const inferredActions = inferActionsFromBackend(areaData, definition.backendModules);

  return {
    key: definition.key,
    displayName: definition.displayName,
    description: definition.description,
    enabled: true,
    backendModules: [...definition.backendModules],
    actions: inferredActions,
  };
}

/**
 * Infiere las acciones permitidas desde los permisos del backend
 */
function inferActionsFromBackend(
  areaData: AccessArea,
  backendModules: string[]
): SubModuleConfig["actions"] {
  const actions = {
    view: false,
    create: false,
    update: false,
    delete: false,
    file: false,
  };

  // Analizar todas las rutas del área
  for (const route of areaData.routes || []) {
    if (route.status === false) continue;

    // Buscar módulos relevantes
    for (const module of route.modules || []) {
      if (!backendModules.includes(module.module)) continue;
      if (module.status === false) continue;

      // Analizar acciones del módulo
      for (const action of module.actions || []) {
        if (typeof action === "string") {
          actions[action as keyof typeof actions] = true;
        } else if (action.enabled !== false && action.status !== false) {
          const actionName = action.action as keyof typeof actions;
          if (actionName in actions) {
            actions[actionName] = true;
          }
        }
      }
    }

    // También revisar acciones a nivel de ruta (si no hay módulos específicos)
    if (!route.modules || route.modules.length === 0) {
      for (const action of route.actions || []) {
        if (typeof action === "string") {
          actions[action as keyof typeof actions] = true;
        } else if (action.enabled !== false && action.status !== false) {
          const actionName = action.action as keyof typeof actions;
          if (actionName in actions) {
            actions[actionName] = true;
          }
        }
      }
    }
  }

  return actions;
}
