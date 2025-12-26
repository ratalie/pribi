import { nanoid } from "nanoid";
import { getRecord, putRecord } from "@hexag/registros/shared/mock-database";
import type { DirectorioConfig } from "../../../domain/entities/directorio.entity";
import type { DirectorioDTO } from "../../../application/dtos/directorio.dto";
// import { DirectorioMapper } from "../../mappers/directorio.mapper"; // No usado

const STORE_NAME = "directorioConfig";

const now = () => new Date().toISOString();

function ensureId(value?: string): string {
  if (value && value.length > 0) return value;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return nanoid();
}

type StoredDirectorio = DirectorioConfig & { societyProfileId: string };

/**
 * Obtiene la configuración del directorio de una sociedad
 */
export async function getDirectorioMock(societyProfileId: string): Promise<DirectorioConfig | null> {
  const record = (await getRecord<StoredDirectorio>(STORE_NAME, societyProfileId)) ?? null;
  console.debug("[MSW][DirectorioState] get", { societyProfileId, record });
  return record;
}

/**
 * Crea o actualiza la configuración del directorio
 */
export async function createDirectorioMock(
  societyProfileId: string,
  payload: DirectorioDTO
): Promise<DirectorioConfig> {
  const existing = await getDirectorioMock(societyProfileId);
  const id = existing?.id ?? ensureId(payload.id);

  // Convertir DTO a entidad usando el mapper
  const entity: StoredDirectorio = {
    id,
    societyProfileId,
    cantidadDirectores: payload.cantidadDirectores ?? 0,
    conteoPersonalizado: payload.conteoPersonalizado ?? false,
    minimoDirectores: payload.minimoDirectores ?? null,
    maximoDirectores: payload.maximoDirectores ?? null,
    inicioMandato: payload.inicioMandato ?? "",
    finMandato: payload.finMandato ?? "",
    quorumMinimo: payload.quorumMinimo ?? 0,
    mayoria: payload.mayoria ?? 0,
    presidenteDesignado: payload.presidenteDesignado ?? false,
    secretarioAsignado: payload.secretarioAsignado ?? false,
    reeleccionPermitida: payload.reeleccionPermitida ?? false,
    presidentePreside: payload.presidentePreside ?? false,
    presidenteDesempata: payload.presidenteDesempata ?? false,
    periodo: payload.periodo ?? "1",
    presidenteId: payload.presidenteId ?? null,
    createdAt: existing?.createdAt ?? now(),
    updatedAt: now(),
  };

  console.debug("[MSW][DirectorioState] create:before", { societyProfileId, payload, entity });
  await putRecord(STORE_NAME, entity);
  console.debug("[MSW][DirectorioState] create:after", { societyProfileId, entity });
  return entity;
}

/**
 * Actualiza la configuración del directorio
 */
export async function updateDirectorioMock(
  societyProfileId: string,
  payload: DirectorioDTO
): Promise<DirectorioConfig> {
  return await createDirectorioMock(societyProfileId, payload); // create y update son iguales (upsert)
}

