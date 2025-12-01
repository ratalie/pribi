import { http, HttpResponse } from "msw";
import {
  listDirectoresMock,
  createDirectorMock,
  updateDirectorMock,
  deleteDirectoresMock,
} from "../data/directores.state";
import { DirectorMapper } from "../../mappers/director.mapper";
import type { DirectorDTO } from "../../../application/dtos/director.dto";

const baseUrl = "*/api/v2/society-profile/:id/directorio/directores";

const ensureParam = (value: string | readonly string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/**
 * Convierte DirectorConfig (entidad) a formato backend
 */
function toBackendResponse(director: any): any {
  return DirectorMapper.toPayload({
    id: director.id,
    persona: director.persona,
    rolDirector: director.rolDirector,
    reemplazaId: director.reemplazaId,
  });
}

export const directoresHandlers = [
  http.get(baseUrl, async ({ params }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const directores = await listDirectoresMock(id);
    const datos = directores.map(toBackendResponse);

    const responsePayload = {
      success: true,
      message: "Listado de directores (mock)",
      code: 200,
      data: {
        datos,
      },
    };

    console.debug("[MSW][Directores] GET", { societyProfileId: id, count: directores.length });
    return HttpResponse.json(responsePayload);
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const body = (await request.json()) as DirectorDTO;
    const entity = await createDirectorMock(id, body);

    const responsePayload = {
      success: true,
      message: "Director creado (mock)",
      code: 201,
      data: toBackendResponse(entity),
    };

    console.debug("[MSW][Directores] POST", { societyProfileId: id, entity });
    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  http.put(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const body = (await request.json()) as DirectorDTO;
    if (!body.id) {
      return HttpResponse.json({ error: "Director ID is required for update" }, { status: 400 });
    }

    const entity = await updateDirectorMock(id, body.id, body);

    const responsePayload = {
      success: true,
      message: "Director actualizado (mock)",
      code: 200,
      data: toBackendResponse(entity),
    };

    console.debug("[MSW][Directores] PUT", { societyProfileId: id, directorId: body.id });
    return HttpResponse.json(responsePayload);
  }),

  http.delete(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const directorIds = (await request.json()) as string[];
    if (!Array.isArray(directorIds) || directorIds.length === 0) {
      return HttpResponse.json({ error: "Invalid director IDs" }, { status: 400 });
    }

    const deleted = await deleteDirectoresMock(id, directorIds);
    console.debug("[MSW][Directores] DELETE", { societyProfileId: id, directorIds, deleted });

    if (!deleted) {
      return HttpResponse.json({ error: "Directores no encontrados" }, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      message: "Directores eliminados (mock)",
      code: 200,
    });
  }),
];

