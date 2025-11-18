import { SocietyRegisterStep } from "../../../domain/enums/society-register-step.enum";
import {
  deleteRecord,
  getAllRecords,
  getRecord,
  putRecord,
} from "../../../../shared/mock-database";

const STORE_NAME = "sociedades";

type SocietyStatus = "DRAFT" | "COMPLETED";

export interface SocietyMainDataMock {
  idSociety: string; // KeyPath for mock DB (UUID)
  id: string;
  societyProfileId: string;
  societyId: string;
  profileNumber: number; // Numeric correlativo para facilitar debug
  status: SocietyStatus;
  pasoActual: SocietyRegisterStep;
  createdAt: string;
  updatedAt: string;
  society: {
    id: string;
    societyId: string;
    reasonSocial: string;
    razonSocial: string;
    typeSocietyId: string;
    tipoSocietario: string;
    commercialName: string;
    nombreComercial: string;
    ruc: string;
    numeroRuc: string;
    hasBoard: boolean;
    directorio: boolean;
    registrationDate: string | null;
    fechaRegistroSociedad: string | null;
  };
}

function buildDefaultSociety(profileNumber: number, uuid: string): SocietyMainDataMock {
  const now = new Date().toISOString();
  const profileId = String(profileNumber);

  return {
    idSociety: profileId,
    id: profileId,
    societyProfileId: profileId,
    societyId: profileId,
    profileNumber,
    status: "DRAFT",
    pasoActual: SocietyRegisterStep.DATOS_SOCIEDAD,
    createdAt: now,
    updatedAt: now,
    society: {
      id: uuid,
      societyId: uuid,
      reasonSocial: "Sociedad sin nombre",
      razonSocial: "Sociedad sin nombre",
      typeSocietyId: "S.A.C.",
      tipoSocietario: "S.A.C.",
      commercialName: "",
      nombreComercial: "",
      ruc: "",
      numeroRuc: "",
      hasBoard: false,
      directorio: false,
      registrationDate: null,
      fechaRegistroSociedad: null,
    },
  };
}

async function resolveNextProfileNumber(): Promise<number> {
  const all = await getAllRecords<SocietyMainDataMock>(STORE_NAME);
  const max = all.reduce((acc, item) => Math.max(acc, item.profileNumber ?? 0), 0);
  return max + 1;
}

export async function createSociedadMock(): Promise<SocietyMainDataMock> {
  const profileNumber = await resolveNextProfileNumber();
  const uuid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `soc-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
  const record = buildDefaultSociety(profileNumber, uuid);

  console.debug("[MSW][Sociedades] Creando sociedad mock", record);

  await putRecord(STORE_NAME, record);
  return structuredClone(record);
}

export interface SocietyListItemMock {
  id: number;
  razonSocial: string;
  ruc: string;
  directorio: boolean;
  fechaRegistroSociedad: string | null;
  nombreComercial: string;
  tipoSociedad: string;
  pasoActual: SocietyRegisterStep;
  createdAt: string;
  updatedAt: string;
  societyId: string;
}

export async function listSociedadesMock(): Promise<SocietyListItemMock[]> {
  const data = await getAllRecords<SocietyMainDataMock>(STORE_NAME);
  const ordered = data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  console.debug("[MSW][Sociedades] Listando sociedades mock", ordered);

  return ordered.map((item) => ({
    id: item.profileNumber,
    razonSocial: item.society.razonSocial ?? item.society.reasonSocial ?? "Sociedad sin nombre",
    ruc: item.society.ruc ?? item.society.numeroRuc ?? "",
    directorio: Boolean(item.society.directorio ?? item.society.hasBoard ?? false),
    fechaRegistroSociedad:
      item.society.fechaRegistroSociedad ?? item.society.registrationDate ?? null,
    nombreComercial: item.society.nombreComercial ?? item.society.commercialName ?? "",
    tipoSociedad: item.society.tipoSocietario ?? item.society.typeSocietyId ?? "",
    pasoActual: item.pasoActual,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    societyId: item.society.id ?? item.society.societyId ?? item.idSociety,
  }));
}

export async function deleteSociedadMock(id: string): Promise<boolean> {
  const existing = await getRecord<SocietyMainDataMock>(STORE_NAME, id);
  if (!existing) {
    console.warn("[MSW][Sociedades] Intento de eliminar sociedad inexistente", id);
    return false;
  }

  await deleteRecord(STORE_NAME, id);
  console.debug("[MSW][Sociedades] Eliminada sociedad mock", id);
  return true;
}

