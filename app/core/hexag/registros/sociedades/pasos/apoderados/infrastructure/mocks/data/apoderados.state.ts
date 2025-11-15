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

type StoredClase = ClaseApoderado & { societyProfileId: string };
type StoredApoderado = Apoderado & { societyProfileId: string };

export async function listClasesMock(profileId: string): Promise<ClaseApoderado[]> {
  const clases = (await getAllRecords<StoredClase>(CLASES_STORE)) ?? [];
  const apoderados = await listApoderadosMock(profileId);

  return clases
    .filter((item) => item.societyProfileId === profileId)
    .map((item) => ({
      ...item,
      apoderados: apoderados.filter((apoderado) => apoderado.claseApoderadoId === item.id),
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
  return { ...entity, apoderados: [] };
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
  const apoderados = await listApoderadosMock(profileId);
  return { ...entity, apoderados: apoderados.filter((item) => item.claseApoderadoId === entity.id) };
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
  return apoderados.filter((item) => item.societyProfileId === profileId);
}

export async function createApoderadoMock(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
  const entity: StoredApoderado = {
    id: ensureId(payload.id),
    claseApoderadoId: payload.claseApoderadoId,
    persona: {
      ...payload.persona,
      id: ensureId(payload.persona?.id),
    },
    terminoCargo: payload.terminoCargo,
    fechaInicio: payload.fechaInicio,
    fechaFin: payload.fechaFin ?? null,
    createdAt: now(),
    updatedAt: now(),
    societyProfileId: profileId,
  };

  await putRecord(APODERADOS_STORE, entity);
  return entity;
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
  return entity;
}

export async function deleteApoderadoMock(profileId: string, apoderadoId: string): Promise<void> {
  const record = await getRecord<StoredApoderado>(APODERADOS_STORE, apoderadoId);
  if (record && record.societyProfileId === profileId) {
    await deleteRecord(APODERADOS_STORE, apoderadoId);
  }
}


