import { http, HttpResponse } from "msw";

import { normalizeRegistryOfficeCode, normalizeTypeSocietyCode } from "~/constants/inputs/enum-helpers";
import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";
import {
  createDatosSociedadMock,
  getDatosSociedadMock,
  updateDatosSociedadMock,
} from "../data/datos-sociedad.state";
import type { SociedadDatosGenerales } from "../../../domain";

const baseUrl = "*/api/v2/society-profile/:id/society";

const mapBackendBodyToDto = (body?: Record<string, any>): DatosSociedadDTO => ({
  numeroRuc: body?.numeroRuc ?? body?.ruc ?? "",
  tipoSocietario: normalizeTypeSocietyCode(
    body?.tipoSocietario ??
      body?.tipoSociedad ??
      body?.typeSociety ??
      body?.typeSocietyId ??
      "S.A.C."
  ),
  razonSocial: body?.razonSocial ?? body?.reasonSocial ?? "Sociedad sin nombre",
  nombreComercial: body?.nombreComercial ?? body?.commercialName ?? "",
  direccion: body?.direccion ?? body?.address ?? "",
  distrito: body?.distrito ?? body?.district ?? "",
  provincia: body?.provincia ?? body?.province ?? "",
  departamento: body?.departamento ?? body?.department ?? "",
  fechaInscripcionRuc:
    body?.fechaInscripcionRuc ?? body?.fechaRegistro ?? body?.registrationDate ?? "",
  actividadExterior:
    body?.actividadExterior ?? body?.actividadExtranjera ?? body?.foreignActivity ?? "",
  fechaEscrituraPublica:
    body?.fechaEscrituraPublica ?? body?.fechaEscritura ?? body?.publicDeedDate ?? "",
  fechaRegistrosPublicos:
    body?.fechaRegistrosPublicos ??
    body?.registrationRecordDate ??
    body?.fechaRegistroPublico ??
    "",
  partidaRegistral: body?.partidaRegistral ?? body?.registrationRecord ?? "",
  oficinaRegistral: normalizeRegistryOfficeCode(
    body?.oficinaRegistral ?? body?.registryOffice ?? ""
  ),
  idSociety: body?.idSociety ?? body?.id ?? undefined,
});

const mapDomainToBackend = (entity: SociedadDatosGenerales) => ({
  id: entity.idSociety,
  ruc: entity.numeroRuc,
  reasonSocial: entity.razonSocial,
  typeSociety: entity.tipoSocietario,
  commercialName: entity.nombreComercial,
  address: entity.direccion,
  district: entity.distrito,
  province: entity.provincia,
  department: entity.departamento,
  registrationDate: entity.fechaInscripcionRuc || null,
  foreignActivity: entity.actividadExterior,
  publicDeedDate: entity.fechaEscrituraPublica || null,
  registryOffice: entity.oficinaRegistral,
  registrationRecord: entity.partidaRegistral,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
});

export const datosSociedadHandlers = [
  http.get(baseUrl, async ({ params }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const societyId = id as string;
    const datos = await getDatosSociedadMock(societyId);
    if (!datos) {
      return HttpResponse.json({ error: "Datos de sociedad no encontrados" }, { status: 404 });
    }

    const responsePayload = {
      success: true,
      message: "Datos principales de la sociedad (mock).",
      code: 200,
      data: mapDomainToBackend(datos),
    };

    console.debug("[MSW][DatosSociedad] Response GET", {
      societyProfileId: societyId,
      payload: responsePayload,
    });

    return HttpResponse.json(responsePayload);
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const societyId = id as string;
    const raw = (await request.json()) as Record<string, any> | undefined;
    const payload = mapBackendBodyToDto(raw);

    console.debug("[MSW][DatosSociedad] Request POST", {
      societyProfileId: societyId,
      raw,
      payload,
    });

    const datos = await createDatosSociedadMock(societyId, payload);
    const responsePayload = {
      success: true,
      message: "Datos principales guardados (mock).",
      code: 201,
      data: mapDomainToBackend(datos),
    };

    console.debug("[MSW][DatosSociedad] Response POST", {
      societyProfileId: societyId,
      payload: responsePayload,
    });

    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  http.put(baseUrl, async ({ params, request }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const societyId = id as string;
    const raw = (await request.json()) as Record<string, any> | undefined;
    const payload = mapBackendBodyToDto(raw);

    console.debug("[MSW][DatosSociedad] Request PUT", {
      societyProfileId: societyId,
      raw,
      payload,
    });

    const datos = await updateDatosSociedadMock(societyId, payload);
    const responsePayload = {
      success: true,
      message: "Datos principales actualizados (mock).",
      code: 200,
      data: mapDomainToBackend(datos),
    };

    console.debug("[MSW][DatosSociedad] Response PUT", {
      societyProfileId: societyId,
      payload: responsePayload,
    });

    return HttpResponse.json(responsePayload);
  }),
];
