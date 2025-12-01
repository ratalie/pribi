import { http, HttpResponse } from "msw";
import { getDirectorioMock, createDirectorioMock, updateDirectorioMock } from "../data/directorio.state";
import { DirectorioMapper } from "../../mappers/directorio.mapper";
import type { DirectorioDTO } from "../../../application/dtos/directorio.dto";

const baseUrl = "*/api/v2/society-profile/:id/directorio";

const ensureParam = (value: string | readonly string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const directorioHandlers = [
  http.get(baseUrl, async ({ params }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const config = await getDirectorioMock(id);

    if (!config) {
      return HttpResponse.json({ error: "Directorio no encontrado" }, { status: 404 });
    }

    // Convertir entidad a formato backend usando el mapper
    const payload = DirectorioMapper.toPayload({
      id: config.id,
      cantidadDirectores: config.cantidadDirectores,
      conteoPersonalizado: config.conteoPersonalizado,
      minimoDirectores: config.minimoDirectores,
      maximoDirectores: config.maximoDirectores,
      inicioMandato: config.inicioMandato,
      finMandato: config.finMandato,
      quorumMinimo: config.quorumMinimo,
      mayoria: config.mayoria,
      presidenteDesignado: config.presidenteDesignado,
      secretarioAsignado: config.secretarioAsignado,
      reeleccionPermitida: config.reeleccionPermitida,
      presidentePreside: config.presidentePreside,
      presidenteDesempata: config.presidenteDesempata,
      periodo: config.periodo,
      presidenteId: config.presidenteId,
    });

    const responsePayload = {
      success: true,
      message: "Configuración de directorio obtenida (mock)",
      code: 200,
      data: payload,
    };

    console.debug("[MSW][Directorio] GET", { societyProfileId: id, config });
    return HttpResponse.json(responsePayload);
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const body = (await request.json()) as DirectorioDTO;
    const entity = await createDirectorioMock(id, body);

    // Convertir entidad a formato backend
    const payload = DirectorioMapper.toPayload({
      id: entity.id,
      cantidadDirectores: entity.cantidadDirectores,
      conteoPersonalizado: entity.conteoPersonalizado,
      minimoDirectores: entity.minimoDirectores,
      maximoDirectores: entity.maximoDirectores,
      inicioMandato: entity.inicioMandato,
      finMandato: entity.finMandato,
      quorumMinimo: entity.quorumMinimo,
      mayoria: entity.mayoria,
      presidenteDesignado: entity.presidenteDesignado,
      secretarioAsignado: entity.secretarioAsignado,
      reeleccionPermitida: entity.reeleccionPermitida,
      presidentePreside: entity.presidentePreside,
      presidenteDesempata: entity.presidenteDesempata,
      periodo: entity.periodo,
      presidenteId: entity.presidenteId,
    });

    const responsePayload = {
      success: true,
      message: "Configuración de directorio creada (mock)",
      code: 201,
      data: payload,
    };

    console.debug("[MSW][Directorio] POST", { societyProfileId: id, entity });
    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  http.put(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const body = (await request.json()) as DirectorioDTO;
    const entity = await updateDirectorioMock(id, body);

    // Convertir entidad a formato backend
    const payload = DirectorioMapper.toPayload({
      id: entity.id,
      cantidadDirectores: entity.cantidadDirectores,
      conteoPersonalizado: entity.conteoPersonalizado,
      minimoDirectores: entity.minimoDirectores,
      maximoDirectores: entity.maximoDirectores,
      inicioMandato: entity.inicioMandato,
      finMandato: entity.finMandato,
      quorumMinimo: entity.quorumMinimo,
      mayoria: entity.mayoria,
      presidenteDesignado: entity.presidenteDesignado,
      secretarioAsignado: entity.secretarioAsignado,
      reeleccionPermitida: entity.reeleccionPermitida,
      presidentePreside: entity.presidentePreside,
      presidenteDesempata: entity.presidenteDesempata,
      periodo: entity.periodo,
      presidenteId: entity.presidenteId,
    });

    const responsePayload = {
      success: true,
      message: "Configuración de directorio actualizada (mock)",
      code: 200,
      data: payload,
    };

    console.debug("[MSW][Directorio] PUT", { societyProfileId: id, entity });
    return HttpResponse.json(responsePayload);
  }),
];

