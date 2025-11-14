import { http, HttpResponse } from "msw";
import {
  listAccionistasMock,
  createAccionistaMock,
  updateAccionistaMock,
  deleteAccionistaMock,
} from "../data/accionistas.state";

const baseUrl = "*/api/v2/society-profile/:id/shareholder";

export const accionistasHandlers = [
  http.get(baseUrl, async ({ params }) => {
    const id = params.id;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }
    const data = await listAccionistasMock(id);
    console.debug("[MSW][Accionistas] GET", { societyProfileId: id, count: data.length });
    return HttpResponse.json({
      success: true,
      message: "Listado de accionistas (mock)",
      code: 200,
      data,
    });
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const id = params.id;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }
    const body = (await request.json()) as any;
    const entity = await createAccionistaMock(id, body);
    console.debug("[MSW][Accionistas] POST", { societyProfileId: id, entity });
    return HttpResponse.json(
      {
        success: true,
        message: "Accionista creado (mock)",
        code: 201,
        data: entity,
      },
      { status: 201 }
    );
  }),

  http.put(baseUrl, async ({ params, request }) => {
    const id = params.id;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }
    const body = (await request.json()) as any;
    const entity = await updateAccionistaMock(id, body);
    console.debug("[MSW][Accionistas] PUT", { societyProfileId: id, accionistaId: body?.id });
    return HttpResponse.json({
      success: true,
      message: "Accionista actualizado (mock)",
      code: 200,
      data: entity,
    });
  }),

  http.delete(`${baseUrl}/:shareholderId`, async ({ params }) => {
    const id = params.id;
    const accionistaId = params.shareholderId;
    if (!id || Array.isArray(id) || !accionistaId || Array.isArray(accionistaId)) {
      return HttpResponse.json({ error: "Invalid identifiers" }, { status: 400 });
    }
    const deleted = await deleteAccionistaMock(id, accionistaId);
    console.debug("[MSW][Accionistas] DELETE", { societyProfileId: id, accionistaId, deleted });
    if (!deleted) {
      return HttpResponse.json({ error: "Accionista no encontrado" }, { status: 404 });
    }
    return HttpResponse.json({
      success: true,
      message: "Accionista eliminado (mock)",
      code: 200,
    });
  }),
];

