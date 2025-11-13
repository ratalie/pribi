import { http, HttpResponse } from "msw";

import {
  createDatosSociedadMock,
  getDatosSociedadMock,
  updateDatosSociedadMock,
} from "../data/datos-sociedad.state";
import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";

const baseUrl = "/api/registros/sociedades/:id/datos-sociedad";

export const datosSociedadHandlers = [
  http.get(baseUrl, ({ params }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const datos = getDatosSociedadMock(id);
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

    const body = (await request.json()) as DatosSociedadDTO | undefined;
    const datos = createDatosSociedadMock(id, {
      razonSocial: body?.razonSocial ?? "Sociedad sin nombre",
      tipoSocietario: body?.tipoSocietario ?? "S.A.C.",
      nombreComercial: body?.nombreComercial,
      fechaConstitucion: body?.fechaConstitucion,
      objetoSocial: body?.objetoSocial,
      domicilioLegal: body?.domicilioLegal,
      capitalSocial: body?.capitalSocial,
    });

    return HttpResponse.json({ data: datos }, { status: 201 });
  }),

  http.put(baseUrl, async ({ params, request }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid society id" }, { status: 400 });
    }

    const body = (await request.json()) as DatosSociedadDTO;
    const datos = updateDatosSociedadMock(id, body);
    return HttpResponse.json({ data: datos }, { status: 200 });
  }),
];

