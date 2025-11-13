import { http, HttpResponse } from "msw";

import {
  createSociedadMock,
  deleteSociedadMock,
  listSociedadesMock,
} from "../data/sociedades.state";

export const sociedadesHandlers = [
  http.post("/api/registros/sociedades", async () => {
    const sociedad = await createSociedadMock();
    return HttpResponse.json(
      {
        data: {
          idSociety: sociedad.idSociety,
        },
      },
      { status: 201 }
    );
  }),

  http.get("/api/registros/sociedades", async () => {
    const data = await listSociedadesMock();
    return HttpResponse.json({ data });
  }),

  http.delete("/api/registros/sociedades/:id", async ({ params }) => {
    const idParam = params.id;
    const id =
      typeof idParam === "string"
        ? idParam
        : Array.isArray(idParam)
        ? idParam[0]
        : idParam?.toString();

    if (!id) {
      return HttpResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteSociedadMock(id);
    if (!deleted) {
      return HttpResponse.json({ error: "Society not found" }, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];

