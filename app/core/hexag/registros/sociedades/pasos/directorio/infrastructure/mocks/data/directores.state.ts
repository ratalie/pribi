import { nanoid } from "nanoid";
import { getAllRecords, getRecord, putRecord, deleteRecord } from "@hexag/registros/shared/mock-database";
import type { DirectorConfig } from "../../../domain/entities/director.entity";
import type { DirectorDTO } from "../../../application/dtos/director.dto";
import { DirectorMapper } from "../../mappers/director.mapper";

const STORE_NAME = "directores";

const now = () => new Date().toISOString();

function ensureId(value?: string): string {
  if (value && value.length > 0) return value;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return nanoid();
}

type StoredDirector = DirectorConfig & { societyProfileId?: string };

/**
 * Lista todos los directores de una sociedad
 */
export async function listDirectoresMock(profileId: string): Promise<DirectorConfig[]> {
  const records = (await getAllRecords<StoredDirector>(STORE_NAME)) ?? [];
  return records.filter((item) => item.societyProfileId === profileId);
}

/**
 * Obtiene un director específico
 */
export async function getDirectorMock(profileId: string, directorId: string): Promise<DirectorConfig | null> {
  const record = await getRecord<StoredDirector>(STORE_NAME, directorId);
  if (!record) return null;
  return record.societyProfileId === profileId ? record : null;
}

/**
 * Crea un nuevo director
 */
export async function createDirectorMock(profileId: string, payload: DirectorDTO): Promise<DirectorConfig> {
  const id = ensureId(payload.id);
  
  // Asegurar que el payload tenga ID
  const payloadWithId: DirectorDTO = {
    ...payload,
    id,
  };

  // Convertir DTO a entidad usando el mapper
  const entity = DirectorMapper.toDomain({
    id,
    persona: payload.persona,
    rolDirector: payload.rolDirector,
    reemplazaId: payload.reemplazaId,
  });

  if (!entity) {
    throw new Error("No se pudo crear la entidad Director desde el payload");
  }

  await putRecord(STORE_NAME, {
    ...entity,
    societyProfileId: profileId,
  } as StoredDirector);

  return entity;
}

/**
 * Actualiza un director existente
 */
export async function updateDirectorMock(
  profileId: string,
  directorId: string,
  payload: DirectorDTO
): Promise<DirectorConfig> {
  const current = await getDirectorMock(profileId, directorId);
  if (!current) {
    // Si no existe, crear nuevo
    return createDirectorMock(profileId, { ...payload, id: directorId });
  }

  // Asegurar que el payload tenga el ID correcto
  const payloadWithId: DirectorDTO = {
    ...payload,
    id: directorId,
  };

  // Convertir DTO a entidad usando el mapper
  const entity = DirectorMapper.toDomain({
    id: directorId,
    persona: payload.persona,
    rolDirector: payload.rolDirector,
    reemplazaId: payload.reemplazaId,
  });

  if (!entity) {
    throw new Error("No se pudo actualizar la entidad Director desde el payload");
  }

  await putRecord(STORE_NAME, {
    ...entity,
    societyProfileId: profileId,
  } as StoredDirector);

  return entity;
}

/**
 * Elimina uno o más directores
 */
export async function deleteDirectoresMock(profileId: string, directorIds: string[]): Promise<boolean> {
  let deletedCount = 0;
  
  for (const directorId of directorIds) {
    const existing = await getDirectorMock(profileId, directorId);
    if (existing) {
      await deleteRecord(STORE_NAME, directorId);
      deletedCount++;
    }
  }

  return deletedCount > 0;
}

