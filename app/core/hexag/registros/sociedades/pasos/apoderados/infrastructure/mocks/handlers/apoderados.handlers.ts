import { http, HttpResponse } from "msw";
import {
  listClasesMock,
  createClaseMock,
  updateClaseMock,
  deleteClaseMock,
  listApoderadosMock,
  createApoderadoMock,
  updateApoderadoMock,
  deleteApoderadoMock,
} from "../data/apoderados.state";

const baseUrl = "*/api/v2/society-profile/:id/attorney-register";

const ensureParam = (value: string | readonly string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const apoderadosHandlers = [
  // Clases
  http.get(`${baseUrl}/classes`, async ({ params }) => {
    const id = ensureParam(params.id);
    if (!id) return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    const data = await listClasesMock(id);
    console.debug("[MSW][Apoderados] GET classes", { societyProfileId: id, count: data.length });
    return HttpResponse.json({ success: true, code: 200, data });
  }),

  http.post(`${baseUrl}/classes`, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    const body = (await request.json()) as any;
    const entity = await createClaseMock(id, body);
    console.debug("[MSW][Apoderados] POST class", { societyProfileId: id, entity });
    return HttpResponse.json({ success: true, code: 201, data: entity }, { status: 201 });
  }),

  http.put(`${baseUrl}/classes`, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    const body = (await request.json()) as any;
    const entity = await updateClaseMock(id, body);
    console.debug("[MSW][Apoderados] PUT class", { societyProfileId: id, claseId: body?.id });
    return HttpResponse.json({ success: true, code: 200, data: entity });
  }),

  http.delete(`${baseUrl}/classes/:classId`, async ({ params }) => {
    const id = ensureParam(params.id);
    const claseId = ensureParam(params.classId);
    if (!id || !claseId) {
      return HttpResponse.json({ error: "Invalid identifiers" }, { status: 400 });
    }
    await deleteClaseMock(id, claseId);
    console.debug("[MSW][Apoderados] DELETE class", { societyProfileId: id, claseId });
    return HttpResponse.json({ success: true, code: 200 });
  }),

  // Apoderados
  http.get(`${baseUrl}/attorneys`, async ({ params }) => {
    const id = ensureParam(params.id);
    if (!id) return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    const data = await listApoderadosMock(id);
    console.debug("[MSW][Apoderados] GET attorneys", { societyProfileId: id, count: data.length });
    return HttpResponse.json({ success: true, code: 200, data });
  }),

  http.post(`${baseUrl}/attorneys`, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    const body = (await request.json()) as any;
    const entity = await createApoderadoMock(id, body);
    console.debug("[MSW][Apoderados] POST attorney", { societyProfileId: id, entity });
    return HttpResponse.json({ success: true, code: 201, data: entity }, { status: 201 });
  }),

  http.put(`${baseUrl}/attorneys`, async ({ params, request }) => {
    const id = ensureParam(params.id);
    if (!id) return HttpResponse.json({ error: "Invalid society profile id" }, { status: 400 });
    const body = (await request.json()) as any;
    const entity = await updateApoderadoMock(id, body);
    console.debug("[MSW][Apoderados] PUT attorney", { societyProfileId: id, apoderadoId: body?.id });
    return HttpResponse.json({ success: true, code: 200, data: entity });
  }),

  http.delete(`${baseUrl}/attorneys/:attorneyId`, async ({ params }) => {
    const id = ensureParam(params.id);
    const attorneyId = ensureParam(params.attorneyId);
    if (!id || !attorneyId) {
      return HttpResponse.json({ error: "Invalid identifiers" }, { status: 400 });
    }
    await deleteApoderadoMock(id, attorneyId);
    console.debug("[MSW][Apoderados] DELETE attorney", {
      societyProfileId: id,
      attorneyId,
    });
    return HttpResponse.json({ success: true, code: 200 });
  }),
];


