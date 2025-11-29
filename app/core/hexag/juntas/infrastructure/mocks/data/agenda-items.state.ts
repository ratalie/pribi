import {
  getAllRecords,
  getRecord,
  putRecord,
} from "../../../../shared/mock-database";
import type { AgendaItemsDTO } from "../../../application/dtos/agenda-item.dto";
import { createDefaultAgendaItemsDTO } from "../../../application/dtos/agenda-item.dto";

const STORE_NAME = "agenda-items";

export interface AgendaItemsMockData {
  key: string; // "societyId:flowId" como clave única
  societyId: number;
  flowId: number;
  data: AgendaItemsDTO;
  updatedAt: string;
}

function buildKey(societyId: number, flowId: number): string {
  return `${societyId}:${flowId}`;
}

export async function getAgendaItemsMock(
  societyId: number,
  flowId: number
): Promise<AgendaItemsDTO | null> {
  const key = buildKey(societyId, flowId);
  const record = await getRecord<AgendaItemsMockData>(STORE_NAME, key);

  if (!record) {
    console.debug("[MSW][AgendaItems] No hay datos guardados", { societyId, flowId });
    return null;
  }

  console.debug("[MSW][AgendaItems] Obteniendo agenda items mock", {
    societyId,
    flowId,
    data: record.data,
  });

  return structuredClone(record.data);
}

export async function updateAgendaItemsMock(
  societyId: number,
  flowId: number,
  data: AgendaItemsDTO
): Promise<void> {
  const key = buildKey(societyId, flowId);
  const now = new Date().toISOString();

  const record: AgendaItemsMockData = {
    key,
    societyId,
    flowId,
    data: structuredClone(data),
    updatedAt: now,
  };

  console.debug("[MSW][AgendaItems] Actualizando agenda items mock", {
    societyId,
    flowId,
    data: record.data,
  });

  await putRecord(STORE_NAME, key, record);
}

