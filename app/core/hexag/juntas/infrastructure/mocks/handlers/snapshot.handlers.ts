import { http, HttpResponse } from "msw";
import { getSnapshotMock } from "../data/snapshot.state";

const baseUrl = "*/api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete";

export const snapshotHandlers = [
  // GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
  http.get(baseUrl, async ({ params }) => {
    const societyIdParam = params.societyId;
    const flowIdParam = params.flowId;

    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    // ⚠️ flowId puede ser string (UUID) o number
    let flowId: number;
    if (typeof flowIdParam === "string") {
      // Si es un UUID, intentar parsearlo; si no es numérico, convertir a número de alguna manera
      const parsed = parseInt(flowIdParam, 10);
      flowId = Number.isNaN(parsed) ? 1 : parsed;
    } else if (Array.isArray(flowIdParam)) {
      flowId = parseInt(flowIdParam[0], 10);
    } else {
      flowId = Number(flowIdParam);
    }

    if (!societyId || Number.isNaN(societyId)) {
      console.warn("[MSW][Snapshot] GET sin societyId válido", params);
      return HttpResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const snapshot = await getSnapshotMock(societyId, flowId);

    const responsePayload = {
      success: true,
      message: "Snapshot completo obtenido correctamente (mock).",
      code: 200,
      data: snapshot,
    };

    console.debug(
      "[MSW][Snapshot] Response GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete",
      {
        societyId,
        flowId,
        snapshotSummary: {
          accionistas: snapshot.shareholders.length,
          acciones: snapshot.shareClasses.length,
          asignaciones: snapshot.shareAllocations.length,
          directores: snapshot.directors?.length || 0,
          apoderados: snapshot.attorneys?.length || 0,
        },
      }
    );

    return HttpResponse.json(responsePayload);
  }),
];

