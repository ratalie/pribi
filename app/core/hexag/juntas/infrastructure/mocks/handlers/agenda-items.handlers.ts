import { http, HttpResponse } from "msw";

import {
  getAgendaItemsMock,
  updateAgendaItemsMock,
} from "../data/agenda-items.state";

const baseUrl = "*/api/v2/society-profile/:societyId/assembly/:flowId/agenda-items";

export const agendaItemsHandlers = [
  // GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
  http.get(baseUrl, async ({ params }) => {
    const societyIdParam = params.societyId;
    const flowIdParam = params.flowId;

    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    const flowId =
      typeof flowIdParam === "string"
        ? parseInt(flowIdParam, 10)
        : Array.isArray(flowIdParam)
        ? parseInt(flowIdParam[0], 10)
        : Number(flowIdParam);

    if (!societyId || Number.isNaN(societyId) || !flowId || Number.isNaN(flowId)) {
      console.warn("[MSW][AgendaItems] GET sin parámetros válidos", params);
      return HttpResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const data = await getAgendaItemsMock(societyId, flowId);

    // Si no hay datos, devolver 404 (el repositorio lo maneja como null)
    if (!data) {
      console.debug(
        "[MSW][AgendaItems] GET - No hay datos guardados (404)",
        { societyId, flowId }
      );
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }

    const responsePayload = {
      success: true,
      message: "Puntos de agenda obtenidos correctamente (mock).",
      data,
      code: 200,
    };

    console.debug(
      "[MSW][AgendaItems] Response GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items",
      responsePayload
    );

    return HttpResponse.json(responsePayload);
  }),

  // PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
  http.put(baseUrl, async ({ params, request }) => {
    const societyIdParam = params.societyId;
    const flowIdParam = params.flowId;

    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    const flowId =
      typeof flowIdParam === "string"
        ? parseInt(flowIdParam, 10)
        : Array.isArray(flowIdParam)
        ? parseInt(flowIdParam[0], 10)
        : Number(flowIdParam);

    if (!societyId || Number.isNaN(societyId) || !flowId || Number.isNaN(flowId)) {
      console.warn("[MSW][AgendaItems] PUT sin parámetros válidos", params);
      return HttpResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const body = await request.json();

    await updateAgendaItemsMock(societyId, flowId, body as any);

    const responsePayload = {
      success: true,
      message: "Puntos de agenda actualizados correctamente (mock).",
      code: 200,
    };

    console.debug(
      "[MSW][AgendaItems] Response PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items",
      { societyId, flowId, body }
    );

    return HttpResponse.json(responsePayload);
  }),
];

