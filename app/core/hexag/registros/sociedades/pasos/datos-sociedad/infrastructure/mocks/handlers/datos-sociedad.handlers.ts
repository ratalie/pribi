import { http, HttpResponse } from "msw";

import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";
import {
  createDatosSociedadMock,
  getDatosSociedadMock,
  updateDatosSociedadMock,
} from "../data/datos-sociedad.state";

const baseUrl = "/api/registros/sociedades/:id/datos-sociedad";

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

    return HttpResponse.json({ data: datos });
  }),

  http.post(baseUrl, async ({ params, request }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const societyId = id as string;
    const body = (await request.json()) as DatosSociedadDTO | undefined;
    const datos = await createDatosSociedadMock(societyId, {
      numeroRuc: body?.numeroRuc ?? "",
      tipoSocietario: body?.tipoSocietario ?? "S.A.C.",
      razonSocial: body?.razonSocial ?? "Sociedad sin nombre",
      nombreComercial: body?.nombreComercial ?? "",
      direccion: body?.direccion ?? "",
      distrito: body?.distrito ?? "",
      provincia: body?.provincia ?? "",
      departamento: body?.departamento ?? "",
      fechaInscripcionRuc: body?.fechaInscripcionRuc ?? "",
      actividadExterior: body?.actividadExterior ?? "",
      fechaEscrituraPublica: body?.fechaEscrituraPublica ?? "",
      fechaRegistrosPublicos: body?.fechaRegistrosPublicos ?? "",
      partidaRegistral: body?.partidaRegistral ?? "",
      oficinaRegistral: body?.oficinaRegistral ?? "",
    });

    return HttpResponse.json({ data: datos }, { status: 201 });
  }),

  http.put(baseUrl, async ({ params, request }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const societyId = id as string;
    const body = (await request.json()) as DatosSociedadDTO;
    const datos = await updateDatosSociedadMock(societyId, body);
    return HttpResponse.json({ data: datos }, { status: 200 });
  }),
];
