import {
  deleteRecord,
  getAllRecords,
  getRecord,
  putRecord,
} from "@hexag/registros/shared/mock-database";
import { nanoid } from "nanoid";
import type { AsignacionAccionesDTO } from "../../../domain/ports/asignacion-acciones.repository";

const STORE_NAME = "asignacionAcciones";

const now = () => new Date().toISOString();

function ensureId(value?: string): string {
  if (value && value.length > 0) return value;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return nanoid();
}

type StoredAsignacion = AsignacionAccionesDTO & {
  societyProfileId?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Lista todas las asignaciones de una sociedad
 */
export async function listAsignacionesMock(
  profileId: string
): Promise<AsignacionAccionesDTO[]> {
  const records = (await getAllRecords<StoredAsignacion>(STORE_NAME)) ?? [];
  return records
    .filter((item) => item.societyProfileId === profileId)
    .map(({ societyProfileId, createdAt, updatedAt, ...rest }) => rest);
}

/**
 * Obtiene una asignación específica
 */
export async function getAsignacionMock(
  profileId: string,
  asignacionId: string
): Promise<AsignacionAccionesDTO | null> {
  const record = await getRecord<StoredAsignacion>(STORE_NAME, asignacionId);
  if (!record || record.societyProfileId !== profileId) return null;

  const { societyProfileId, createdAt, updatedAt, ...rest } = record;
  return rest;
}

/**
 * Crea una nueva asignación
 */
export async function createAsignacionMock(
  profileId: string,
  payload: AsignacionAccionesDTO
): Promise<AsignacionAccionesDTO> {
  const id = ensureId(payload.id);

  const stored: StoredAsignacion = {
    ...payload,
    id,
    societyProfileId: profileId,
    createdAt: now(),
    updatedAt: now(),
  };

  await putRecord(STORE_NAME, stored);

  const { societyProfileId, createdAt, updatedAt, ...rest } = stored;
  return rest;
}

/**
 * Elimina una asignación
 */
export async function deleteAsignacionMock(
  profileId: string,
  asignacionId: string
): Promise<boolean> {
  const existing = await getAsignacionMock(profileId, asignacionId);
  if (!existing) {
    console.warn(
      "[MSW][AsignacionAcciones] Intento de eliminar asignación inexistente",
      asignacionId
    );
    return false;
  }

  await deleteRecord(STORE_NAME, asignacionId);
  console.debug("[MSW][AsignacionAcciones] Eliminada asignación mock", asignacionId);
  return true;
}
