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
    return {
      role: simpleRole,
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
        (route) => route.status !== false && (route.actions?.length > 0 || route.modules?.length > 0)
      );

      if (hasEnabledRoute) {
        enabledAreas.add(area.area);
        console.log('[mapOverridesToSimpleConfig] Área habilitada:', area.area);
      }
    }
  }

  const modules = AVAILABLE_AREAS.map((area) => ({
    area,
    enabled: enabledAreas.has(area as AccessAreaEnum),
    submodules: [],
  }));

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
