import { http, HttpResponse } from "msw";
import type { AsignacionAccionesDTO } from "../../../domain/ports/asignacion-acciones.repository";
import {
  createAsignacionMock,
  deleteAsignacionMock,
  listAsignacionesMock,
} from "../data/asignacion-acciones.state";

const baseUrl = "*/api/v2/society-profile/:id/share-assignment";

const ensureParam = (value: string | readonly string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const asignacionAccionesHandlers = [
  http.get(baseUrl, async ({ params }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const data = await listAsignacionesMock(id);
    const responsePayload = {
      success: true,
      message: "Listado de asignaciones (mock)",
      code: 200,
      data,
    };

    console.debug("[MSW][AsignacionAcciones] GET", {
      societyProfileId: id,
      count: data.length,
    });
    return HttpResponse.json(responsePayload);
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const body = (await request.json()) as AsignacionAccionesDTO;
    const entity = await createAsignacionMock(id, body);

    const responsePayload = {
      success: true,
      message: "Asignación creada (mock)",
      code: 201,
      data: entity.id,
    };

    console.debug("[MSW][AsignacionAcciones] POST", { societyProfileId: id, entity });
    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  http.delete(`${baseUrl}/:assignmentId`, async ({ params }) => {
    const id = ensureParam(params.id);
    const assignmentId = ensureParam(params.assignmentId);
    if (!id || !assignmentId) {
      return HttpResponse.json({ error: "Invalid identifiers" }, { status: 400 });
    }

    const deleted = await deleteAsignacionMock(id, assignmentId);
    console.debug("[MSW][AsignacionAcciones] DELETE", {
      societyProfileId: id,
      assignmentId,
      deleted,
    });

    if (!deleted) {
      return HttpResponse.json({ error: "Asignación no encontrada" }, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      message: "Asignación eliminada (mock)",
      code: 200,
    });
  }),
];

