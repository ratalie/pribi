import { getRecord, putRecord } from "../../../../../../shared/mock-database";
import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../../../domain";

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

function buildEntity(
  idSociety: string,
  payload: DatosSociedadDTO,
  previous?: SociedadDatosGenerales | null
): SociedadDatosGenerales {
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
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
}

const STORE_NAME = "datosSociedad";

export async function getDatosSociedadMock(
  idSociety: string
): Promise<SociedadDatosGenerales | null> {
  return (await getRecord<SociedadDatosGenerales>(STORE_NAME, idSociety)) ?? null;
}

export async function createDatosSociedadMock(
  idSociety: string,
  payload: DatosSociedadDTO = defaultPayload
): Promise<SociedadDatosGenerales> {
  const entity = buildEntity(idSociety, payload);
  await putRecord(STORE_NAME, entity);
  return entity;
}

export async function updateDatosSociedadMock(
  idSociety: string,
  payload: DatosSociedadDTO
): Promise<SociedadDatosGenerales> {
  const current =
    (await getDatosSociedadMock(idSociety)) ??
    (await createDatosSociedadMock(idSociety, payload));
  const entity = buildEntity(
    idSociety,
    {
      ...defaultPayload,
      ...current,
      ...payload,
    },
    current
  );
  await putRecord(STORE_NAME, entity);
  return entity;
}
