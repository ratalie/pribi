import { http, HttpResponse } from "msw";
import type { AccionDTO } from "../../../application/dtos/accion.dto";
import { AccionesMapper } from "../../mappers/acciones.mapper";
import {
  createAccionMock,
  deleteAccionesMock,
  listAccionesMock,
  updateAccionMock,
} from "../data/acciones.state";

const baseUrl = "*/api/v2/society-profile/:id/acction";

const ensureParam = (value: string | readonly string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/**
 * Convierte AccionDTO del backend a AccionPayload del dominio
 */
function toAccionPayload(dto: AccionDTO): any {
  return {
    id: dto.id,
    tipo: dto.tipo,
    nombreAccion: dto.nombre,
    accionesSuscritas: dto.cantidadSuscrita,
    derechoVoto: dto.conDerechoVoto,
    redimible: dto.redimible,
    otrosDerechosEspeciales: Boolean(dto.archivoOtrosDerechos?.length),
    archivosOtrosDerechos: dto.archivoOtrosDerechos,
    obligacionesAdicionales: Boolean(dto.archivoObligaciones?.length),
    archivosObligaciones: dto.archivoObligaciones,
    comentariosAdicionales: Boolean(dto.comentariosAdicionales),
    comentariosAdicionalesTexto: dto.comentariosAdicionales,
  };
}

/**
 * Convierte Accion (entidad) a AccionResponseDTO (formato backend)
 */
function toBackendResponse(accion: any): any {
  const payload = AccionesMapper.deEntityAPayload(accion);
  return {
    id: accion.id,
    tipo: accion.tipo,
    nombre: payload.nombreAccion,
    cantidadSuscrita: accion.accionesSuscritas,
    redimible: accion.redimibles,
    conDerechoVoto: accion.derechoVoto,
    archivoOtrosDerechos: accion.metadataDerechosEspeciales.map((f: any) => ({
      fileId: f.fileId,
      mimeType: f.mimeType,
      originalName: f.originalName,
      size: f.size,
    })),
    archivoObligaciones: accion.metadataObligaciones.map((f: any) => ({
      fileId: f.fileId,
      mimeType: f.mimeType,
      originalName: f.originalName,
      size: f.size,
    })),
    comentariosAdicionales: accion.comentariosAdicionalesTexto || undefined,
  };
}

export const accionesHandlers = [
  http.get(baseUrl, async ({ params }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const acciones = await listAccionesMock(id);
    const datos = acciones.map(toBackendResponse);

    const responsePayload = {
      success: true,
      message: "Listado de acciones (mock)",
      code: 200,
      data: {
        datos,
        paginacion: {
          tieneSiguientePagina: false,
          cantidad: datos.length,
        },
      },
    };

    console.debug("[MSW][Acciones] GET", { societyProfileId: id, count: acciones.length });
    return HttpResponse.json(responsePayload);
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const body = (await request.json()) as AccionDTO;
    const payload = toAccionPayload(body);
    const entity = await createAccionMock(id, payload);

    const responsePayload = {
      success: true,
      message: "Acción creada (mock)",
      code: 201,
    };

    console.debug("[MSW][Acciones] POST", { societyProfileId: id, entity });
    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  http.put(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const body = (await request.json()) as AccionDTO;
    const payload = toAccionPayload(body);
    const entity = await updateAccionMock(id, payload);

    const responsePayload = {
      success: true,
      message: "Acción actualizada (mock)",
      code: 200,
    };

    console.debug("[MSW][Acciones] PUT", { societyProfileId: id, accionId: body.id });
    return HttpResponse.json(responsePayload);
  }),

  http.delete(baseUrl, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) {
      return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    }

    const accionIds = (await request.json()) as string[];
    if (!Array.isArray(accionIds) || accionIds.length === 0) {
      return HttpResponse.json({ error: "Invalid action IDs" }, { status: 400 });
    }

    const deleted = await deleteAccionesMock(id, accionIds);
    console.debug("[MSW][Acciones] DELETE", { societyProfileId: id, accionIds, deleted });

    if (!deleted) {
      return HttpResponse.json({ error: "Acciones no encontradas" }, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      message: "Acciones eliminadas (mock)",
      code: 200,
    });
  }),
];
