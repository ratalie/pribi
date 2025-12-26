import {
  deleteRecord,
  getAllRecords,
  getRecord,
  putRecord,
} from "~/core/hexag/registros/shared/mock-database";

const STORE_NAME = "juntas";

export interface JuntaMockData {
  id: string; // flowStructureId (UUID)
  societyId: number; // ID de la sociedad asociada
  estado: string; // statusProgression
  actual: string; // currentStep
  createdAt: string;
  updatedAt: string;
}

function buildDefaultJunta(societyId: number, uuid: string): JuntaMockData {
  const now = new Date().toISOString();

  return {
    id: uuid,
    societyId,
    estado: "BORRADOR",
    actual: "INIT", // Paso inicial
    createdAt: now,
    updatedAt: now,
  };
}

async function resolveNextFlowId(): Promise<string> {
  const all = await getAllRecords<JuntaMockData>(STORE_NAME);
  const max = all.length;
  return `flow-${max + 1}-${Date.now()}`;
}

export async function createJuntaMock(societyId: number): Promise<JuntaMockData> {
  const uuid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : await resolveNextFlowId();
  const record = buildDefaultJunta(societyId, uuid);

  console.debug("[MSW][Juntas] Creando junta mock", record);

  await putRecord(STORE_NAME, record);
  return structuredClone(record);
}

export async function listJuntasMock(societyId: number): Promise<JuntaMockData[]> {
  const all = await getAllRecords<JuntaMockData>(STORE_NAME);
  const filtered = all.filter((item) => item.societyId === societyId);
  const ordered = filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  console.debug("[MSW][Juntas] Listando juntas mock", {
    societyId,
    count: ordered.length,
  });

  return ordered;
}

export async function deleteJuntaMock(societyId: number, flowId: string): Promise<boolean> {
  const existing = await getRecord<JuntaMockData>(STORE_NAME, flowId);
  if (!existing) {
    console.warn("[MSW][Juntas] Intento de eliminar junta inexistente", {
      societyId,
      flowId,
    });
    return false;
  }

  if (existing.societyId !== societyId) {
    console.warn("[MSW][Juntas] La junta no pertenece a la sociedad", {
      societyId,
      flowId,
      juntaSocietyId: existing.societyId,
    });
    return false;
  }

  await deleteRecord(STORE_NAME, flowId);
  console.debug("[MSW][Juntas] Eliminada junta mock", { societyId, flowId });
  return true;
}
