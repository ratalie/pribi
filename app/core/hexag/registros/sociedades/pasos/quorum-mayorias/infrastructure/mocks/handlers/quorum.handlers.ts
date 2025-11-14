import { http, HttpResponse } from "msw";

import type { QuorumDTO } from "../../../application";
import type { QuorumConfig } from "../../../domain";
import {
  createQuorumMock,
  getQuorumMock,
  updateQuorumMock,
} from "../data/quorum.state";

const baseUrl = "*/api/v2/society-profile/:id/quorum";

const toQuorumDTO = (body?: Record<string, any>): QuorumDTO => ({
  id: body?.id ?? undefined,
  primeraConvocatoriaSimple: Number(body?.primeraConvocatoriaSimple ?? body?.primera_simple ?? 51),
  primeraConvocatoriaCalificada: Number(
    body?.primeraConvocatoriaCalificada ?? body?.primera_calificada ?? 67
  ),
  segundaConvocatoriaSimple: Number(
    body?.segundaConvocatoriaSimple ?? body?.segunda_simple ?? 40
  ),
  segundaConvocatoriaCalificada: Number(
    body?.segundaConvocatoriaCalificada ?? body?.segunda_calificada ?? 60
  ),
  quorumMinimoSimple: Number(body?.quorumMinimoSimple ?? body?.quorum_simple ?? 10),
  quorumMinimoCalificado: Number(
    body?.quorumMinimoCalificado ?? body?.quorum_calificado ?? 20
  ),
});

const toBackend = (entity: QuorumConfig) => ({
  id: entity.id,
  primeraConvocatoriaSimple: entity.primeraConvocatoriaSimple,
  primeraConvocatoriaCalificada: entity.primeraConvocatoriaCalificada,
  segundaConvocatoriaSimple: entity.segundaConvocatoriaSimple,
  segundaConvocatoriaCalificada: entity.segundaConvocatoriaCalificada,
  quorumMinimoSimple: entity.quorumMinimoSimple,
  quorumMinimoCalificado: entity.quorumMinimoCalificado,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
});

export const quorumHandlers = [
  http.get(baseUrl, async ({ params }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const config = await getQuorumMock(id);
    if (!config) {
      return HttpResponse.json({ error: "Quorum not found" }, { status: 404 });
    }

    const responsePayload = {
      success: true,
      message: "Quórum obtenido correctamente (mock).",
      code: 200,
      data: toBackend(config),
    };

    console.debug("[MSW][Quorum] Response GET", { id, payload: responsePayload });
    return HttpResponse.json(responsePayload);
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const raw = (await request.json()) as Record<string, any> | undefined;
    const dto = toQuorumDTO(raw);

    console.debug("[MSW][Quorum] Request POST", { id, raw, dto });
    const config = await createQuorumMock(id, dto);

    const responsePayload = {
      success: true,
      message: "Quórum creado correctamente (mock).",
      code: 201,
      data: toBackend(config),
    };

    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  http.put(baseUrl, async ({ params, request }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const raw = (await request.json()) as Record<string, any> | undefined;
    const dto = toQuorumDTO(raw);

    console.debug("[MSW][Quorum] Request PUT", { id, raw, dto });
    const config = await updateQuorumMock(id, dto);

    const responsePayload = {
      success: true,
      message: "Quórum actualizado correctamente (mock).",
      code: 200,
      data: toBackend(config),
    };

    return HttpResponse.json(responsePayload);
  }),
];

