import { http, HttpResponse } from "msw";

import {
  createSociedadMock,
  deleteSociedadMock,
  listSociedadesMock,
} from "../data/sociedades.state";

const baseListUrl = "*/api/v2/society-profile/list";
const baseProfileUrl = "*/api/v2/society-profile";

export const sociedadesHandlers = [
  http.post(baseProfileUrl, async () => {
    const sociedad = await createSociedadMock();
    const responsePayload = {
      success: true,
      message: "Sociedad creada correctamente (mock).",
      code: 201,
      data: sociedad.profileNumber,
      meta: {
        idSociety: sociedad.idSociety,
        pasoActual: sociedad.pasoActual,
      },
    };

    console.debug("[MSW][Sociedades] Response POST /api/v2/society-profile", responsePayload);

    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  http.get(baseListUrl, async () => {
    const data = await listSociedadesMock();
    const responsePayload = {
      success: true,
      message: "Listado de sociedades (mock).",
      code: 200,
      data,
    };

    console.debug("[MSW][Sociedades] Response GET /api/v2/society-profile/list", responsePayload);

    return HttpResponse.json(responsePayload);
  }),

  http.delete("*/api/v2/society-profile/:id", async ({ params }) => {
    const idParam = params.id;
    const id =
      typeof idParam === "string"
        ? idParam
        : Array.isArray(idParam)
        ? idParam[0]
        : idParam?.toString();

    if (!id) {
      console.warn("[MSW][Sociedades] DELETE sin id válido", params);
      return HttpResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteSociedadMock(id);
    if (!deleted) {
      console.warn("[MSW][Sociedades] DELETE sociedad no encontrada", id);
      return HttpResponse.json({ error: "Society not found" }, { status: 404 });
    }

    console.debug("[MSW][Sociedades] Response DELETE /api/v2/society-profile/:id", { id });

    return new HttpResponse(null, { status: 204 });
  }),
];

