export interface SociedadResumenMock {
  idSociety: string;
  razonSocial: string;
  tipoSocietario: string;
  estado: "borrador" | "completo";
  createdAt: string;
  updatedAt: string;
}

const sociedadesState: SociedadResumenMock[] = [];

export function createSociedadMock(): SociedadResumenMock {
  const now = new Date().toISOString();
  const nueva: SociedadResumenMock = {
    idSociety: crypto.randomUUID(),
    razonSocial: "Sociedad sin nombre",
    tipoSocietario: "S.A.C.",
    estado: "borrador",
    createdAt: now,
    updatedAt: now,
  };

  sociedadesState.unshift(nueva);
  return nueva;
}

export function listSociedadesMock(): SociedadResumenMock[] {
  return [...sociedadesState];
}

export function deleteSociedadMock(id: string): boolean {
  const index = sociedadesState.findIndex((sociedad) => sociedad.idSociety === id);
  if (index === -1) {
    return false;
  }

  sociedadesState.splice(index, 1);
  return true;
}

