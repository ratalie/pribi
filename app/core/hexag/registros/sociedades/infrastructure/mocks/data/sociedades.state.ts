import { deleteRecord, getAllRecords, getRecord, putRecord } from "../../../../shared/mock-database";

export interface SociedadResumenMock {
  idSociety: string;
  razonSocial: string;
  tipoSocietario: string;
  estado: "borrador" | "completo";
  createdAt: string;
  updatedAt: string;
}

const STORE_NAME = "sociedades";

export async function createSociedadMock(): Promise<SociedadResumenMock> {
  const now = new Date().toISOString();
  const nueva: SociedadResumenMock = {
    idSociety: crypto.randomUUID(),
    razonSocial: "Sociedad sin nombre",
    tipoSocietario: "S.A.C.",
    estado: "borrador",
    createdAt: now,
    updatedAt: now,
  };

  await putRecord(STORE_NAME, nueva);
  return nueva;
}

export async function listSociedadesMock(): Promise<SociedadResumenMock[]> {
  const data = await getAllRecords<SociedadResumenMock>(STORE_NAME);
  return data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function deleteSociedadMock(id: string): Promise<boolean> {
  const existing = await getRecord<SociedadResumenMock>(STORE_NAME, id);
  if (!existing) {
    return false;
  }

  await deleteRecord(STORE_NAME, id);
  return true;
}

