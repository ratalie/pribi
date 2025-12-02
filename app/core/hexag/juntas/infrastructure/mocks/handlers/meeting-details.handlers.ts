import { http, HttpResponse } from "msw";
import {
  getMeetingDetailsMock,
  updateMeetingDetailsMock,
} from "../data/meeting-details.state";
import type { MeetingDetails } from "../../../domain/entities/meeting-details.entity";
import type { Convocatoria } from "../../../domain/entities/convocatoria.entity";
import type { GeneralMeetingConfigDto, MeetingCallDto } from "../../../application/dtos/meeting-details.dto";
import { ModoReunion } from "../../../domain/enums/modo-reunion.enum";

const baseUrl = "*/api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details";

/**
 * Helper: Convierte Entity a DTO del backend (para el GET)
 */
function entityToBackendDto(entity: MeetingDetails): GeneralMeetingConfigDto {
  const convocatoriaToMeetingCall = (conv: Convocatoria): MeetingCallDto => ({
    address: conv.direccion,
    mode: conv.modo, // Ya viene como 'IN_PERSON' o 'VIRTUAL'
    date: conv.fecha.toISOString(),
    time: conv.hora.toISOString(),
  });

  // Convertir OrdenConvocatoria a formato backend
  let heldAtCall: 'FIRST' | 'SECOND' | undefined;
  if (entity.instaladaEnConvocatoria) {
    heldAtCall = entity.instaladaEnConvocatoria === 'PRIMERA' ? 'FIRST' : 'SECOND';
  }

  return {
    id: entity.id || crypto.randomUUID(),
    meetingType: entity.tipoJunta,
    isAnnualMandatory: entity.esAnualObligatoria,
    firstCall: entity.primeraConvocatoria
      ? convocatoriaToMeetingCall(entity.primeraConvocatoria)
      : undefined,
    secondCall: entity.segundaConvocatoria
      ? convocatoriaToMeetingCall(entity.segundaConvocatoria)
      : undefined,
    heldAtCall,
    presidentId: entity.presidenteId,
    secretaryId: entity.secretarioId,
    presidentAttended: entity.presidenteAsistio,
    secretaryAttended: entity.secretarioAsistio,
    otherPresidentName: entity.nombreOtroPresidente,
    otherSecretaryName: entity.nombreOtroSecretario,
  };
}

export const meetingDetailsHandlers = [
  // GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
  http.get(baseUrl, async ({ params }) => {
    const societyIdParam = params.societyId;
    const flowIdParam = params.flowId;

    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    const flowId =
      typeof flowIdParam === "string"
        ? parseInt(flowIdParam, 10)
        : Array.isArray(flowIdParam)
        ? parseInt(flowIdParam[0], 10)
        : Number(flowIdParam);

    if (!societyId || Number.isNaN(societyId) || !flowId || Number.isNaN(flowId)) {
      console.warn("[MSW][MeetingDetails] GET sin parámetros válidos", params);
      return HttpResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const entity = await getMeetingDetailsMock(societyId, flowId);

    // Si no hay entity, retornar 404
    if (!entity) {
      console.debug("[MSW][MeetingDetails] GET - No hay datos (404)", { societyId, flowId });
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Convertir Entity a DTO del backend (GeneralMeetingConfigDto)
    const backendDto = entityToBackendDto(entity);

    const responsePayload = {
      success: true,
      message: "Detalles de la junta obtenidos correctamente (mock).",
      data: backendDto,
      code: 200,
    };

    console.debug(
      "[MSW][MeetingDetails] Response GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details",
      { societyId, flowId, data: backendDto }
    );

    return HttpResponse.json(responsePayload);
  }),

  // PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details
  http.put(baseUrl, async ({ params, request }) => {
    const societyIdParam = params.societyId;
    const flowIdParam = params.flowId;

    const societyId =
      typeof societyIdParam === "string"
        ? parseInt(societyIdParam, 10)
        : Array.isArray(societyIdParam)
        ? parseInt(societyIdParam[0], 10)
        : Number(societyIdParam);

    const flowId =
      typeof flowIdParam === "string"
        ? parseInt(flowIdParam, 10)
        : Array.isArray(flowIdParam)
        ? parseInt(flowIdParam[0], 10)
        : Number(flowIdParam);

    if (!societyId || Number.isNaN(societyId) || !flowId || Number.isNaN(flowId)) {
      console.warn("[MSW][MeetingDetails] PUT sin parámetros válidos", params);
      return HttpResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const body = (await request.json()) as MeetingDetails;

    await updateMeetingDetailsMock(societyId, flowId, body);

    const responsePayload = {
      success: true,
      message: "Detalles de la junta actualizados correctamente (mock).",
      code: 200,
    };

    console.debug(
      "[MSW][MeetingDetails] Response PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details",
      { societyId, flowId, data: body }
    );

    return HttpResponse.json(responsePayload);
  }),
];

