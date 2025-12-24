import { http, HttpResponse } from 'msw';
import {
  getUserAccessMock,
  getUserAccessFullMock,
  getMyAccessMock,
  updateUserOverridesMock,
  getStudyWhitelistMock,
  updateStudyWhitelistMock,
} from '../data/permissions.state';
import { AccessAreaMapper } from '../../mappers/access-area.mapper';
import { UserOverrideMapper } from '../../mappers/user-override.mapper';
import type { AccessAreaDto } from '../../../application/dtos/access-area.dto';
import type { UserOverrideDto } from '../../../application/dtos/user-override.dto';

const basePath = '*/api/v1/access-management';
const superadminPath = '*/api/v1/superadmin';

/**
 * Handlers MSW para permisos
 */
export const permissionsHandlers = [
  // GET /v1/access-management/users/:id/access
  http.get(`${basePath}/users/:userId/access`, async ({ params }) => {
    const userId = params.userId as string;
    const access = getUserAccessMock(userId);
    const dto: AccessAreaDto[] = AccessAreaMapper.toDtoArray(access);

    const response = {
      success: true,
      message: 'Accesos obtenidos correctamente (mock)',
      code: 200,
      data: dto,
    };

    console.debug('[MSW][Permissions] Response GET /users/:id/access', response);

    return HttpResponse.json(response);
  }),

  // GET /v1/access-management/users/:id/access/full
  http.get(`${basePath}/users/:userId/access/full`, async ({ params }) => {
    const userId = params.userId as string;
    const access = getUserAccessFullMock(userId);
    const dto: AccessAreaDto[] = AccessAreaMapper.toDtoArray(access);

    const response = {
      success: true,
      message: 'Accesos completos obtenidos correctamente (mock)',
      code: 200,
      data: dto,
    };

    console.debug('[MSW][Permissions] Response GET /users/:id/access/full', response);

    return HttpResponse.json(response);
  }),

  // GET /v1/access-management/me/access
  http.get(`${basePath}/me/access`, async () => {
    const access = getMyAccessMock();
    const dto: AccessAreaDto[] = AccessAreaMapper.toDtoArray(access);

    const response = {
      success: true,
      message: 'Mis accesos obtenidos correctamente (mock)',
      code: 200,
      data: dto,
    };

    console.debug('[MSW][Permissions] Response GET /me/access', response);

    return HttpResponse.json(response);
  }),

  // PUT /v1/access-management/users/:id/access
  http.put(`${basePath}/users/:userId/access`, async ({ params, request }) => {
    const userId = params.userId as string;
    const body = (await request.json()) as UserOverrideDto;

    // Convertir DTO a entidades
    const overrides = UserOverrideMapper.toDomain(body, userId);

    // Actualizar en memoria
    updateUserOverridesMock(userId, overrides);

    const response = {
      success: true,
      message: 'Overrides actualizados correctamente (mock)',
      code: 200,
      data: true,
    };

    console.debug('[MSW][Permissions] Response PUT /users/:id/access', response);

    return HttpResponse.json(response);
  }),

  // GET /v1/superadmin/studies/:id/modules
  http.get(`${superadminPath}/studies/:studyId/modules`, async ({ params }) => {
    const studyId = params.studyId as string;
    const modules = getStudyWhitelistMock(studyId);

    const response = {
      success: true,
      message: 'Whitelist obtenida correctamente (mock)',
      code: 200,
      data: { modules },
    };

    console.debug('[MSW][Permissions] Response GET /superadmin/studies/:id/modules', response);

    return HttpResponse.json(response);
  }),

  // PUT /v1/superadmin/studies/:id/modules
  http.put(`${superadminPath}/studies/:studyId/modules`, async ({ params, request }) => {
    const studyId = params.studyId as string;
    const body = (await request.json()) as { modules: string[] };

    // Actualizar en memoria
    updateStudyWhitelistMock(studyId, body.modules);

    const response = {
      success: true,
      message: 'Whitelist actualizada correctamente (mock)',
      code: 200,
      data: true,
    };

    console.debug('[MSW][Permissions] Response PUT /superadmin/studies/:id/modules', response);

    return HttpResponse.json(response);
  }),
];






