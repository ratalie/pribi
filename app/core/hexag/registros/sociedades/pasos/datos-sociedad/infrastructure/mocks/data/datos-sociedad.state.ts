import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../../../domain";

type DatosSociedadStorage = Record<string, SociedadDatosGenerales>;

const datosSociedadState: DatosSociedadStorage = {};

const defaultPayload: DatosSociedadDTO = {
  numeroRuc: "",
  tipoSocietario: "S.A.C.",
  razonSocial: "Sociedad sin nombre",
  nombreComercial: "",
  direccion: "",
  distrito: "",
  provincia: "",
  departamento: "",
  fechaInscripcionRuc: "",
  actividadExterior: "",
  fechaEscrituraPublica: "",
  fechaRegistrosPublicos: "",
  partidaRegistral: "",
  oficinaRegistral: "",
};

function buildEntity(idSociety: string, payload: DatosSociedadDTO): SociedadDatosGenerales {
  const now = new Date().toISOString();
  return {
    idSociety,
    numeroRuc: payload.numeroRuc,
    tipoSocietario: payload.tipoSocietario,
    razonSocial: payload.razonSocial,
    nombreComercial: payload.nombreComercial,
    direccion: payload.direccion,
    distrito: payload.distrito,
    provincia: payload.provincia,
    departamento: payload.departamento,
    fechaInscripcionRuc: payload.fechaInscripcionRuc,
    actividadExterior: payload.actividadExterior,
    fechaEscrituraPublica: payload.fechaEscrituraPublica,
    fechaRegistrosPublicos: payload.fechaRegistrosPublicos,
    partidaRegistral: payload.partidaRegistral,
    oficinaRegistral: payload.oficinaRegistral,
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
