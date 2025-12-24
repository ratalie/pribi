import type { AccessArea } from '../../../domain/entities/access-area.entity';
import type { UserOverride } from '../../../domain/entities/user-override.entity';
import { AccessAreaEnum } from '../../../domain/enums/access-area.enum';
import { PermissionActionEnum } from '../../../domain/enums/permission-action.enum';
import { FlowCodeEnum } from '../../../domain/enums/flow-code.enum';

/**
 * Estado en memoria para mocks de permisos
 */

// Mock de permisos por usuario
const mockUserAccess: Record<string, AccessArea[]> = {
  'user-1': [
    {
      area: AccessAreaEnum.REGISTROS,
      displayName: 'Registros',
      description: 'Gestión de registros de sociedades',
      routes: [
        {
          key: 'dashboard',
          path: '/registros/sociedades/dashboard',
          displayName: 'Dashboard',
          description: 'Vista general de sociedades',
          actions: [
            { action: PermissionActionEnum.VIEW, enabled: true },
            { action: PermissionActionEnum.CREATE, enabled: true },
          ],
        },
        {
          key: 'historial',
          path: '/registros/sociedades/historial',
          displayName: 'Historial',
          description: 'Listado de todas las sociedades',
          actions: [
            { action: PermissionActionEnum.VIEW, enabled: true },
            { action: PermissionActionEnum.CREATE, enabled: true },
            { action: PermissionActionEnum.UPDATE, enabled: true },
            { action: PermissionActionEnum.DELETE, enabled: true },
          ],
        },
        {
          key: 'crear',
          path: '/registros/sociedades/agregar',
          displayName: 'Crear Sociedad',
          description: 'Registrar una nueva sociedad',
          actions: [
            { action: PermissionActionEnum.CREATE, enabled: true },
          ],
          modules: [
            {
              module: 'SOCIETY',
              displayName: 'Datos de Sociedad',
              actions: [
                { action: PermissionActionEnum.VIEW, enabled: true },
                { action: PermissionActionEnum.CREATE, enabled: true },
                { action: PermissionActionEnum.UPDATE, enabled: true },
              ],
            },
            {
              module: 'SHAREHOLDER',
              displayName: 'Accionistas',
              actions: [
                { action: PermissionActionEnum.VIEW, enabled: true },
                { action: PermissionActionEnum.CREATE, enabled: true },
              ],
            },
          ],
        },
      ],
    },
    {
      area: AccessAreaEnum.OPERACIONES,
      displayName: 'Operaciones',
      description: 'Gestión de juntas de accionistas',
      routes: [
        {
          key: 'historial',
          path: '/operaciones/junta-accionistas/historial',
          displayName: 'Historial de Juntas',
          description: 'Listado de todas las juntas',
          actions: [
            { action: PermissionActionEnum.VIEW, enabled: true },
          ],
        },
      ],
    },
  ],
  'user-2': [
    {
      area: AccessAreaEnum.REGISTROS,
      displayName: 'Registros',
      description: 'Gestión de registros de sociedades',
      routes: [
        {
          key: 'dashboard',
          path: '/registros/sociedades/dashboard',
          displayName: 'Dashboard',
          description: 'Vista general de sociedades',
          actions: [
            { action: PermissionActionEnum.VIEW, enabled: true },
          ],
        },
        {
          key: 'historial',
          path: '/registros/sociedades/historial',
          displayName: 'Historial',
          description: 'Listado de todas las sociedades',
          actions: [
            { action: PermissionActionEnum.VIEW, enabled: true },
          ],
        },
      ],
    },
  ],
};

// Mock de whitelist por estudio
const mockStudyWhitelist: Record<string, string[]> = {
  'study-1': ['SOCIETY', 'SHAREHOLDER', 'CAPITAL_ACTIONS', 'BOARD_OF_DIRECTORS'],
  'study-2': ['SOCIETY', 'SHAREHOLDER'],
};

// Mock de overrides por usuario
const mockUserOverrides: Record<string, UserOverride[]> = {};

/**
 * Obtiene permisos efectivos de un usuario (mock)
 */
export function getUserAccessMock(userId: string): AccessArea[] {
  return mockUserAccess[userId] || [];
}

/**
 * Obtiene permisos completos de un usuario incluyendo deshabilitados (mock)
 */
export function getUserAccessFullMock(userId: string): AccessArea[] {
  const access = getUserAccessMock(userId);
  
  // Agregar algunos permisos deshabilitados para el editor
  return access.map((area) => ({
    ...area,
    routes: area.routes.map((route) => ({
      ...route,
      status: true,
      actions: [
        ...route.actions,
        // Agregar algunas acciones deshabilitadas
        { action: PermissionActionEnum.FILE, enabled: false, disabled: true },
      ],
    })),
  }));
}

/**
 * Obtiene mis propios permisos (mock)
 */
export function getMyAccessMock(): AccessArea[] {
  // Por defecto, retornar permisos de user-1
  return getUserAccessMock('user-1');
}

/**
 * Actualiza overrides de un usuario (mock)
 */
export function updateUserOverridesMock(userId: string, overrides: UserOverride[]): void {
  mockUserOverrides[userId] = overrides;
  console.debug('[MSW][Permissions] Updated overrides for user', userId, overrides);
}

/**
 * Obtiene whitelist de un estudio (mock)
 */
export function getStudyWhitelistMock(studyId: string): string[] {
  return mockStudyWhitelist[studyId] || [];
}

/**
 * Actualiza whitelist de un estudio (mock)
 */
export function updateStudyWhitelistMock(studyId: string, modules: string[]): void {
  mockStudyWhitelist[studyId] = modules;
  console.debug('[MSW][Permissions] Updated whitelist for study', studyId, modules);
}






