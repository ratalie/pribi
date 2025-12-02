import { getRecord, putRecord } from "~/core/hexag/registros/shared/mock-database";
import type { MeetingDetails } from "../../../domain/entities/meeting-details.entity";
import { TipoJunta } from "../../../domain/enums/tipo-junta.enum";

const STORE_NAME = "meeting-details";

export interface MeetingDetailsMockData {
  key: string; // "societyId:flowId" como clave única
  societyId: number;
  flowId: number;
  data: MeetingDetails;
  updatedAt: string;
}

function buildKey(societyId: number, flowId: number): string {
  return `${societyId}:${flowId}`;
}

/**
 * Crea un MeetingDetails por defecto cuando no hay datos guardados
 */
function createDefaultMeetingDetails(): MeetingDetails {
  return {
    tipoJunta: TipoJunta.UNIVERSAL,
    esAnualObligatoria: false,
    presidenteAsistio: false,
    secretarioAsistio: false,
  };
}

export async function getMeetingDetailsMock(
  societyId: number,
  flowId: number
): Promise<MeetingDetails | null> {
  const key = buildKey(societyId, flowId);
  const record = await getRecord<MeetingDetailsMockData>(STORE_NAME, key);

  if (!record) {
    console.debug("[MSW][MeetingDetails] No hay datos guardados", { societyId, flowId });
    // Retornar datos por defecto en lugar de null
    return createDefaultMeetingDetails();
  }

  console.debug("[MSW][MeetingDetails] Obteniendo meeting details mock", {
    societyId,
    flowId,
    data: record.data,
  });

  // ⚠️ IMPORTANTE: Rehidratar fechas como Date objects
  const data = structuredClone(record.data);
  if (data.primeraConvocatoria) {
    data.primeraConvocatoria.fecha = new Date(data.primeraConvocatoria.fecha);
    data.primeraConvocatoria.hora = new Date(data.primeraConvocatoria.hora);
  }
  if (data.segundaConvocatoria) {
    data.segundaConvocatoria.fecha = new Date(data.segundaConvocatoria.fecha);
    data.segundaConvocatoria.hora = new Date(data.segundaConvocatoria.hora);
  }

  return data;
}

export async function updateMeetingDetailsMock(
  societyId: number,
  flowId: number,
  data: MeetingDetails
): Promise<void> {
  const key = buildKey(societyId, flowId);
  const now = new Date().toISOString();

  const record: MeetingDetailsMockData = {
    key,
    societyId,
    flowId,
    data: structuredClone(data),
    updatedAt: now,
  };

  console.debug("[MSW][MeetingDetails] Actualizando meeting details mock", {
    societyId,
    flowId,
    data: record.data,
  });

  await putRecord(STORE_NAME, record);
}

