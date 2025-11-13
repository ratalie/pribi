import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../../../domain";

type DatosSociedadStorage = Record<string, SociedadDatosGenerales>;

const datosSociedadState: DatosSociedadStorage = {};

const defaultPayload: DatosSociedadDTO = {
  razonSocial: "Sociedad sin nombre",
  tipoSocietario: "S.A.C.",
  nombreComercial: "",
  fechaConstitucion: "",
  objetoSocial: "",
  domicilioLegal: "",
  capitalSocial: 0,
};

function buildEntity(idSociety: string, payload: DatosSociedadDTO): SociedadDatosGenerales {
  const now = new Date().toISOString();
  return {
    idSociety,
    razonSocial: payload.razonSocial,
    nombreComercial: payload.nombreComercial,
    tipoSocietario: payload.tipoSocietario,
    fechaConstitucion: payload.fechaConstitucion,
    objetoSocial: payload.objetoSocial,
    domicilioLegal: payload.domicilioLegal,
    capitalSocial: payload.capitalSocial,
    createdAt: datosSociedadState[idSociety]?.createdAt ?? now,
    updatedAt: now,
  };
}

export function getDatosSociedadMock(idSociety: string): SociedadDatosGenerales | null {
  return datosSociedadState[idSociety] ?? null;
}

export function createDatosSociedadMock(
  idSociety: string,
  payload: DatosSociedadDTO = defaultPayload
): SociedadDatosGenerales {
  const entity = buildEntity(idSociety, payload);
  datosSociedadState[idSociety] = entity;
  return entity;
}

export function updateDatosSociedadMock(
  idSociety: string,
  payload: DatosSociedadDTO
): SociedadDatosGenerales {
  const current = datosSociedadState[idSociety] ?? createDatosSociedadMock(idSociety, payload);
  const entity = buildEntity(idSociety, {
    ...defaultPayload,
    ...current,
    ...payload,
  });
  datosSociedadState[idSociety] = entity;
  return entity;
}

