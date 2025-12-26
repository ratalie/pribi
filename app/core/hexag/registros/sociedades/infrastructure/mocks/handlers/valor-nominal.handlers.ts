import { http, HttpResponse } from "msw";
import {
  getValorNominalMock,
  updateValorNominalMock,
} from "../data/valor-nominal.state";

const baseUrl = "*/api/v2/society-profile/:id/nominal-value";

export const valorNominalHandlers = [
  // GET /api/v2/society-profile/:id/nominal-value
  http.get(baseUrl, async ({ params }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const societyId = id as string;
    const valorNominal = await getValorNominalMock(societyId);

    const responsePayload = {
      success: true,
      message: "Valor nominal obtenido correctamente (mock).",
      code: 200,
      data: valorNominal,
    };

    console.debug("[MSW][ValorNominal] Response GET", {
      societyId,
      valorNominal,
      payload: responsePayload,
    });

    return HttpResponse.json(responsePayload);
  }),

  // PUT /api/v2/society-profile/:id/nominal-value
  http.put(baseUrl, async ({ params, request }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const societyId = id as string;
    const body = (await request.json()) as {
      valorNominal: number;
      tipoAccionesSociedad?: "COMUNES_SIN_DERECHO_VOTO" | "CON_CLASES" | null;
    } | undefined;

    if (!body || typeof body.valorNominal !== "number") {
      return HttpResponse.json(
        { error: "Invalid payload: valorNominal is required" },
        { status: 400 }
      );
    }

    console.debug("[MSW][ValorNominal] Request PUT", {
      societyId,
      body,
    });

    const result = await updateValorNominalMock(
      societyId,
      body.valorNominal,
      body.tipoAccionesSociedad
    );

    const responsePayload = {
      success: true,
      message: "Valor nominal actualizado correctamente (mock).",
      code: 200,
    };

    console.debug("[MSW][ValorNominal] Response PUT", {
      societyId,
      result,
      payload: responsePayload,
    });

    return HttpResponse.json(responsePayload);
  }),
];


