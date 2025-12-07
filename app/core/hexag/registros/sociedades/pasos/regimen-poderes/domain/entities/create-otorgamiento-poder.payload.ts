import type {
  BaseOtorgamientoPoderPayloadCreate,
  BaseReglaMonetariaPayload,
  LimiteMonetarioPayload,
  TipoFirmaPayload,
} from "./otorgamiento-poderes-payload-base";

export type CreateOtorgamientoPoderPayload = BaseOtorgamientoPoderPayloadCreate &
  ReglaMonetaria;

//reglas monetarias
type ReglaMonetaria = ConReglasMonetarias | SinReglasMonetarias;

interface ConReglasMonetarias {
  tieneReglasFirma: true;
  reglasMonetarias: CreateReglaMonetariaPayload[];
}

interface SinReglasMonetarias {
  tieneReglasFirma: false;
}

export type CreateReglaMonetariaPayload = BaseReglaMonetariaPayload &
  LimiteMonetarioPayload &
  TipoFirmaPayload;
