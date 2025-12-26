import { nanoid } from "nanoid";

import {
  deleteRecord,
  getAllRecords,
  getRecord,
  putRecord,
} from "@hexag/registros/shared/mock-database";
import type { Apoderado, ClaseApoderado } from "../../../domain";
import type { ApoderadoDTO, ClaseApoderadoDTO } from "../../../application";

const CLASES_STORE = "apoderadosClases";
const APODERADOS_STORE = "apoderadosRegistro";

const ensureId = (value?: string) => {
  if (value && value.length > 0) return value;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return nanoid();
};

const now = () => new Date().toISOString();

type StoredClase = ClaseApoderado & { 
  societyProfileId: string;
  createdAt: string;
  updatedAt: string;
};
type StoredApoderado = Apoderado & { 
  societyProfileId: string;
  createdAt: string;
  updatedAt: string;
};

export async function listClasesMock(profileId: string): Promise<ClaseApoderado[]> {
  const clases = (await getAllRecords<StoredClase>(CLASES_STORE)) ?? [];
  const _apoderados = await listApoderadosMock(profileId);

  return clases
    .filter((item) => item.societyProfileId === profileId)
    .map((item) => ({
      id: item.id,
      nombre: item.nombre,
    }));
}

export async function createClaseMock(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado> {
  const entity: StoredClase = {
    id: ensureId(payload.id),
    nombre: payload.nombre,
    societyProfileId: profileId,
    createdAt: now(),
    updatedAt: now(),
  };

  await putRecord(CLASES_STORE, entity);
  return {
    id: entity.id,
    nombre: entity.nombre,
  };
}

export async function updateClaseMock(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado> {
  const existing = await getRecord<StoredClase>(CLASES_STORE, payload.id);
  const entity: StoredClase = {
    id: payload.id,
    nombre: payload.nombre,
    societyProfileId: profileId,
    createdAt: existing?.createdAt ?? now(),
    updatedAt: now(),
  };

  await putRecord(CLASES_STORE, entity);
  return {
    id: entity.id,
    nombre: entity.nombre,
  };
}

export async function deleteClaseMock(profileId: string, claseId: string): Promise<void> {
  await deleteRecord(CLASES_STORE, claseId);
  const apoderados = await getAllRecords<StoredApoderado>(APODERADOS_STORE);
  for (const apoderado of apoderados ?? []) {
    if (apoderado.claseApoderadoId === claseId && apoderado.societyProfileId === profileId) {
      await deleteRecord(APODERADOS_STORE, apoderado.id);
    }
  }
}

export async function listApoderadosMock(profileId: string): Promise<Apoderado[]> {
  const apoderados = (await getAllRecords<StoredApoderado>(APODERADOS_STORE)) ?? [];
  return apoderados
    .filter((item) => item.societyProfileId === profileId)
    .map((item) => ({
      id: item.id,
      claseApoderadoId: item.claseApoderadoId,
      persona: item.persona,
    }));
}

export async function createApoderadoMock(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
  const entity: StoredApoderado = {
    id: ensureId(payload.id),
    claseApoderadoId: payload.claseApoderadoId,
    persona: {
      ...payload.persona,
      id: ensureId(payload.persona?.id),
    },
    createdAt: now(),
    updatedAt: now(),
    societyProfileId: profileId,
  };

  await putRecord(APODERADOS_STORE, entity);
  return {
    id: entity.id,
    claseApoderadoId: entity.claseApoderadoId,
    persona: entity.persona,
  };
}

export async function updateApoderadoMock(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
  const current =
    (await getRecord<StoredApoderado>(APODERADOS_STORE, payload.id)) ??
    ((await createApoderadoMock(profileId, payload)) as StoredApoderado);

  const entity: StoredApoderado = {
    ...current,
    ...payload,
    persona: {
      ...(payload.persona ?? current.persona),
      id: ensureId(payload.persona?.id ?? current.persona.id),
    },
    updatedAt: now(),
  };

  await putRecord(APODERADOS_STORE, entity);
  return {
    id: entity.id,
    claseApoderadoId: entity.claseApoderadoId,
    persona: entity.persona,
  };
}

export async function deleteApoderadoMock(profileId: string, apoderadoId: string): Promise<void> {
  console.log('[MSW][ApoderadosState] deleteApoderadoMock', { profileId, apoderadoId });
  const record = await getRecord<StoredApoderado>(APODERADOS_STORE, apoderadoId);
  console.log('[MSW][ApoderadosState] deleteApoderadoMock:record', record);
  
  if (record && record.societyProfileId === profileId) {
    await deleteRecord(APODERADOS_STORE, apoderadoId);
    console.log('[MSW][ApoderadosState] deleteApoderadoMock:deleted', { apoderadoId });
  } else {
    console.warn('[MSW][ApoderadosState] deleteApoderadoMock:no-match', { 
      recordProfileId: record?.societyProfileId, 
      providedProfileId: profileId 
    });
  }
}


