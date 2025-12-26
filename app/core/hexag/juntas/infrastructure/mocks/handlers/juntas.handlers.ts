import { http, HttpResponse } from "msw";

import {
  createJuntaMock,
  deleteJuntaMock,
  listJuntasMock,
} from "../data/juntas.state";

const baseUrl = "*/api/v2/society-profile/:societyId/register-assembly";

export const juntasHandlers = [
  // POST /api/v2/society-profile/:societyId/register-assembly
  http.post(baseUrl, async ({ params }) => {
    const societyIdParam = params.societyId;
    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    if (!societyId || Number.isNaN(societyId)) {
      console.warn("[MSW][Juntas] POST sin societyId válido", params);
      return HttpResponse.json({ error: "Invalid societyId" }, { status: 400 });
    }

    const junta = await createJuntaMock(societyId);
    const responsePayload = {
      success: true,
      message: "Flujo de Junta creado correctamente (mock).",
      code: 201,
      data: {
        flowStructureId: junta.id,
      },
    };

    console.debug(
      "[MSW][Juntas] Response POST /api/v2/society-profile/:societyId/register-assembly",
      responsePayload
    );

    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  // GET /api/v2/society-profile/:societyId/register-assembly/list
  http.get(`${baseUrl}/list`, async ({ params }) => {
    const societyIdParam = params.societyId;
    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    if (!societyId || Number.isNaN(societyId)) {
      console.warn("[MSW][Juntas] GET list sin societyId válido", params);
      return HttpResponse.json({ error: "Invalid societyId" }, { status: 400 });
    }

    const data = await listJuntasMock(societyId);
    const responsePayload = {
      success: true,
      message: "Listado de juntas (mock).",
      code: 200,
      data: data.map((item) => ({
        id: item.id,
        estado: item.estado,
        actual: item.actual,
      })),
    };

    console.debug(
      "[MSW][Juntas] Response GET /api/v2/society-profile/:societyId/register-assembly/list",
      responsePayload
    );

    return HttpResponse.json(responsePayload);
  }),

  // DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId
  http.delete(`${baseUrl}/:flowId`, async ({ params }) => {
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
        ? flowIdParam
        : Array.isArray(flowIdParam)
        ? flowIdParam[0]
        : flowIdParam?.toString();

    if (!societyId || Number.isNaN(societyId) || !flowId) {
      console.warn("[MSW][Juntas] DELETE sin parámetros válidos", params);
      return HttpResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const deleted = await deleteJuntaMock(societyId, flowId);
    if (!deleted) {
      console.warn("[MSW][Juntas] DELETE junta no encontrada", {
        societyId,
        flowId,
      });
      return HttpResponse.json({ error: "Junta not found" }, { status: 404 });
    }

    console.debug(
      "[MSW][Juntas] Response DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId",
      { societyId, flowId }
    );

    return new HttpResponse(null, { status: 204 });
  }),
];

