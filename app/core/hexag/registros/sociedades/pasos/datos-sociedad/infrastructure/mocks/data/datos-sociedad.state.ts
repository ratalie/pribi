import {
  normalizeRegistryOfficeCode,
  normalizeTypeSocietyCode,
} from "~/constants/inputs/enum-helpers";
import { getRecord, putRecord } from "../../../../../../shared/mock-database";
import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../../../domain";

const defaultPayload: DatosSociedadDTO = {
  idSociety: undefined,
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
    tipoSocietario: normalizeTypeSocietyCode(payload.tipoSocietario),
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
    oficinaRegistral: normalizeRegistryOfficeCode(payload.oficinaRegistral),
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
}

const STORE_NAME = "datosSociedad";

export async function getDatosSociedadMock(
  idSociety: string
): Promise<SociedadDatosGenerales | null> {
  const record = (await getRecord<SociedadDatosGenerales>(STORE_NAME, idSociety)) ?? null;
  console.debug("[MSW][DatosSociedadState] get", { idSociety, record });
  return record;
}

export async function createDatosSociedadMock(
  idSociety: string,
  payload: DatosSociedadDTO = defaultPayload
): Promise<SociedadDatosGenerales> {
  const entity = buildEntity(idSociety, {
    ...defaultPayload,
    ...payload,
    idSociety: payload.idSociety ?? idSociety,
  });
  console.debug("[MSW][DatosSociedadState] create:before", { idSociety, payload, entity });
  await putRecord(STORE_NAME, entity);
  console.debug("[MSW][DatosSociedadState] create:after", {
    idSociety,
    entity,
  });
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
      idSociety: payload.idSociety ?? current.idSociety ?? idSociety,
    },
    current
  );
  console.debug("[MSW][DatosSociedadState] update:before-save", {
    idSociety,
    payload,
    current,
    entity,
  });
  await putRecord(STORE_NAME, entity);
  console.debug("[MSW][DatosSociedadState] update:after-save", { idSociety, entity });
  return entity;
}
