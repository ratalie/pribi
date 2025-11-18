import { getRecord, putRecord } from "@hexag/registros/shared/mock-database";
import type { QuorumDTO } from "../../../application";
import type { QuorumConfig } from "../../../domain";

const STORE_NAME = "quorumConfig";

const defaultPayload: QuorumDTO = {
  primeraConvocatoriaSimple: 51,
  primeraConvocatoriaCalificada: 67,
  segundaConvocatoriaSimple: 40,
  segundaConvocatoriaCalificada: 60,
  quorumMinimoSimple: 10,
  quorumMinimoCalificado: 20,
};

const buildEntity = (
  id: string,
  payload: QuorumDTO,
  previous?: QuorumConfig | null
): QuorumConfig => {
  const now = new Date().toISOString();
  return {
    id,
    primeraConvocatoriaSimple: payload.primeraConvocatoriaSimple,
    primeraConvocatoriaCalificada: payload.primeraConvocatoriaCalificada,
    segundaConvocatoriaSimple: payload.segundaConvocatoriaSimple,
    segundaConvocatoriaCalificada: payload.segundaConvocatoriaCalificada,
    quorumMinimoSimple: payload.quorumMinimoSimple,
    quorumMinimoCalificado: payload.quorumMinimoCalificado,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
};

export async function getQuorumMock(societyProfileId: string): Promise<QuorumConfig | null> {
  const record =
    (await getRecord<QuorumConfig>(STORE_NAME, societyProfileId)) ?? null;
  console.debug("[MSW][QuorumState] get", { societyProfileId, record });
  return record;
}

export async function createQuorumMock(
  societyProfileId: string,
  payload: QuorumDTO = defaultPayload
): Promise<QuorumConfig> {
  const entity = buildEntity(societyProfileId, { ...defaultPayload, ...payload });
  console.debug("[MSW][QuorumState] create:before", { societyProfileId, payload, entity });
  await putRecord(STORE_NAME, entity);
  console.debug("[MSW][QuorumState] create:after", { societyProfileId, entity });
  return entity;
}

export async function updateQuorumMock(
  societyProfileId: string,
  payload: QuorumDTO
): Promise<QuorumConfig> {
  const current =
    (await getQuorumMock(societyProfileId)) ??
    (await createQuorumMock(societyProfileId, payload));
  const entity = buildEntity(
    societyProfileId,
    {
      ...defaultPayload,
      ...payload,
    },
    current
  );
  console.debug("[MSW][QuorumState] update:before-save", {
    societyProfileId,
    payload,
    current,
    entity,
  });
  await putRecord(STORE_NAME, entity);
  console.debug("[MSW][QuorumState] update:after-save", { societyProfileId, entity });
  return entity;
}

