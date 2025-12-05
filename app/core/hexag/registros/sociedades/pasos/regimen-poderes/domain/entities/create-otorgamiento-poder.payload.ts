import type {
  BaseOtorgamientoPoderPayload,
  BaseReglaMonetariaPayload,
  LimiteMonetarioPayload,
  TipoFirmaPayload,
} from "./otorgamiento-poderes-payload-base";

export type CreateOtorgamientoPoderPayload = BaseOtorgamientoPoderPayload & ReglaMonetaria;

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
