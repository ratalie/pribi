import { http, HttpResponse } from "msw";

import {
  createSociedadMock,
  deleteSociedadMock,
  listSociedadesMock,
} from "../data/sociedades.state";

export const sociedadesHandlers = [
  http.post("/api/registros/sociedades", async () => {
    const sociedad = createSociedadMock();
    return HttpResponse.json(
      {
        data: {
          idSociety: sociedad.idSociety,
        },
      },
      { status: 201 }
    );
  }),

  http.get("/api/registros/sociedades", () => {
    return HttpResponse.json({
      data: listSociedadesMock(),
    });
  }),

  http.delete("/api/registros/sociedades/:id", ({ params }) => {
    const { id } = params;
    if (!id || Array.isArray(id)) {
      return HttpResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = deleteSociedadMock(id);
    if (!deleted) {
      return HttpResponse.json({ error: "Society not found" }, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];

