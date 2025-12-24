import type { SimplePermissionsConfig } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
import type { AccessArea } from "~/core/hexag/permissions/domain/entities/access-area.entity";
import type { AccessAreaEnum } from "~/core/hexag/permissions/domain/enums/access-area.enum";
import { AVAILABLE_AREAS } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";

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
  currentRole: "Administrador" | "Usuario" | "Lector"
): SimplePermissionsConfig {
  // Determinar rol simple
  let simpleRole: "Administrador" | "Editor" | "Lector" = "Editor";
  if (currentRole === "Administrador" || currentRole === "SuperAdministrador") {
    simpleRole = "Administrador";
  } else if (currentRole === "Lector") {
    simpleRole = "Lector";
  }

  // Si es Administrador, retornar configuración por defecto
  if (simpleRole === "Administrador") {
    return {
      role: "Administrador",
      modules: AVAILABLE_AREAS.map((area) => ({
        area,
        enabled: true,
        submodules: [],
      })),
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
        (route) => route.status !== false && route.actions && route.actions.length > 0
      );

      if (hasEnabledRoute) {
        enabledAreas.add(area.area);
      }
    }
  }

  const modules = AVAILABLE_AREAS.map((area) => ({
    area,
    enabled: enabledAreas.has(area as AccessAreaEnum),
    submodules: [],
  }));

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
      for (const action of route.actions || []) {
        // El backend puede usar 'status' (boolean) o 'enabled' (boolean)
        // En PermissionAction entity, 'enabled' es el campo principal
        const actionEnabled = action.enabled !== false && action.status !== false;
        if (actionEnabled) {
          availableActions.add(action.action);
        }
      }

      // También revisar acciones en módulos dentro de rutas
      for (const module of route.modules || []) {
        if (module.status === false) continue;

        for (const action of module.actions || []) {
          // El backend puede usar 'status' (boolean) o 'enabled' (boolean)
          const actionEnabled = action.enabled !== false && action.status !== false;
          if (actionEnabled) {
            availableActions.add(action.action);
          }
        }
      }
    }
  }

  // Mapear acciones (el backend puede usar 'read'/'write' o 'view'/'create')
  const actions = {
    view: availableActions.has("view") || availableActions.has("read"),
    create: availableActions.has("create") || availableActions.has("write"),
    update: availableActions.has("update"),
    delete: availableActions.has("delete"),
    file: availableActions.has("file"),
  };

  // Si es Lector, forzar solo 'view'
  if (simpleRole === "Lector") {
    actions.create = false;
    actions.update = false;
    actions.delete = false;
    actions.file = false;
  }

  return {
    role: simpleRole,
    modules,
    societies: {
      mode: "all", // Por defecto, se asume todas (esto se carga por separado)
      ids: [],
    },
    actions,
  };
}
