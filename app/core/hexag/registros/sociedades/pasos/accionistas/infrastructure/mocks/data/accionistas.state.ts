import { nanoid } from "nanoid";

import { getAllRecords, getRecord, putRecord, deleteRecord } from "@hexag/registros/shared/mock-database";
import type { Accionista } from "../../../domain";
import type { AccionistaDTO } from "../../../application/dtos/accionista.dto";

const STORE_NAME = "accionistas";

const now = () => new Date().toISOString();

function ensureId(value?: string) {
  if (value && value.length > 0) return value;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return nanoid();
}

type StoredAccionista = Accionista & { societyProfileId?: string };

export async function listAccionistasMock(profileId: string): Promise<Accionista[]> {
  const records = (await getAllRecords<StoredAccionista>(STORE_NAME)) ?? [];
  return records.filter((item) => item.societyProfileId === profileId);
}

export async function getAccionistaMock(profileId: string, accionistaId: string): Promise<Accionista | null> {
  const record = await getRecord<StoredAccionista>(STORE_NAME, accionistaId);
  if (!record) return null;
  return record.societyProfileId === profileId ? record : null;
}

export async function createAccionistaMock(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
  const id = ensureId(payload.id);
  const personaId = ensureId(payload.persona?.id);
  const entity: Accionista = {
    id,
    persona: {
      ...payload.persona,
      id: personaId,
    } as Accionista["persona"],
    participacionPorcentual: payload.participacionPorcentual,
    createdAt: now(),
    updatedAt: now(),
  };

  await putRecord(STORE_NAME, {
    ...entity,
    societyProfileId: profileId,
  } as StoredAccionista);

  return entity;
}

export async function updateAccionistaMock(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
  if (!payload.id) {
    throw new Error("El payload de actualización de accionista requiere un id.");
  }
  const current =
    (await getAccionistaMock(profileId, payload.id)) ??
    (await createAccionistaMock(profileId, payload));

  const entity: Accionista = {
    id: current.id,
    persona: {
      ...(current.persona ?? {}),
      ...(payload.persona ?? {}),
    } as Accionista["persona"],
    participacionPorcentual: payload.participacionPorcentual ?? current.participacionPorcentual,
    createdAt: current.createdAt ?? now(),
    updatedAt: now(),
  };

  await putRecord(STORE_NAME, {
    ...entity,
    societyProfileId: profileId,
  } as StoredAccionista);

  return entity;
}

export async function deleteAccionistaMock(profileId: string, accionistaId: string): Promise<boolean> {
  const record = await getAccionistaMock(profileId, accionistaId);
  if (!record) return false;
  await deleteRecord(STORE_NAME, accionistaId);
  return true;
}

