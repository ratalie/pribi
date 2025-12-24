import type { SimplePermissionsConfig } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';
import type { AccessArea } from '~/core/hexag/permissions/domain/entities/access-area.entity';
import type { AccessAreaEnum } from '~/core/hexag/permissions/domain/enums/access-area.enum';
import { AVAILABLE_AREAS } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';

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
  currentRole: 'Administrador' | 'Usuario' | 'Lector',
): SimplePermissionsConfig {
  // Determinar rol simple
  let simpleRole: 'Administrador' | 'Editor' | 'Lector' = 'Editor';
  if (currentRole === 'Administrador' || currentRole === 'SuperAdministrador') {
    simpleRole = 'Administrador';
  } else if (currentRole === 'Lector') {
    simpleRole = 'Lector';
  }

  // Si es Administrador, retornar configuración por defecto
  if (simpleRole === 'Administrador') {
    return {
      role: 'Administrador',
      modules: AVAILABLE_AREAS.map((area) => ({
        area,
        enabled: true,
        submodules: [],
      })),
      societies: {
        mode: 'all',
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
  const enabledAreas = new Set<AccessAreaEnum>();
  for (const area of accessAreas) {
    if (area.routes && area.routes.length > 0) {
      enabledAreas.add(area.area);
    }
  }

  const modules = AVAILABLE_AREAS.map((area) => ({
    area,
    enabled: enabledAreas.has(area as AccessAreaEnum),
    submodules: [],
  }));

  // Determinar acciones permitidas
  // Analizar las rutas para ver qué acciones están disponibles
  const availableActions = new Set<string>();
  
  for (const area of accessAreas) {
    for (const route of area.routes || []) {
      for (const action of route.actions || []) {
        availableActions.add(action);
      }
      
      // También revisar acciones en módulos dentro de rutas
      for (const module of route.modules || []) {
        for (const action of module.actions || []) {
          availableActions.add(action);
        }
      }
    }
  }

  // Mapear acciones
  const actions = {
    view: availableActions.has('view') || availableActions.has('read'),
    create: availableActions.has('create') || availableActions.has('write'),
    update: availableActions.has('update'),
    delete: availableActions.has('delete'),
    file: availableActions.has('file'),
  };

  // Si es Lector, forzar solo 'view'
  if (simpleRole === 'Lector') {
    actions.create = false;
    actions.update = false;
    actions.delete = false;
    actions.file = false;
  }

  return {
    role: simpleRole,
    modules,
    societies: {
      mode: 'all', // Por defecto, se asume todas (esto se carga por separado)
      ids: [],
    },
    actions,
  };
}


