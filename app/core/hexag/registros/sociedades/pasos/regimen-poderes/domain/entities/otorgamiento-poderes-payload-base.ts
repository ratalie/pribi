import type { EntityCoinUIEnum, TipoFirmasUIEnum, TipoMontoUIEnum } from "..";
import type { ScopeUIEnum } from "../enums/ScopeUIEnum";
import type { Firmante } from "./otorgamiento-poderes.entity";

// Tipo base para UPDATE (sin poderId ni claseApoderadoId porque no se pueden cambiar)
export interface BaseOtorgamientoPoderPayloadUpdate {
  id: string;
  esIrrevocable: boolean;
  fechaInicio: Date;
  fechaFin?: Date;
}

// Tipo base para CREATE con scope (discriminated union)
export type BaseOtorgamientoPoderPayloadCreate =
  | BaseOtorgamientoPoderPayloadCreateClase
  | BaseOtorgamientoPoderPayloadCreateApoderado;

interface BaseOtorgamientoPoderPayloadCreateClase {
  id: string;
  poderId: string;
  scope: ScopeUIEnum.CLASS;
  claseApoderadoId: string;
  esIrrevocable: boolean;
  fechaInicio: Date;
  fechaFin?: Date;
}

interface BaseOtorgamientoPoderPayloadCreateApoderado {
  id: string;
  poderId: string;
  scope: ScopeUIEnum.ATTORNEY;
  apoderadoId: string;
  esIrrevocable: boolean;
  fechaInicio: Date;
  fechaFin?: Date;
}

export interface BaseReglaMonetariaPayload {
  id: string;
  tipoMoneda: EntityCoinUIEnum;
  montoDesde: number;
}

//tipos de limite monetario: tipando datos correctos
export type LimiteMonetarioPayload = ConLimitePayload | SinLimitePayload;

interface ConLimitePayload {
  tipoLimite: TipoMontoUIEnum.MONTO;
  montoHasta: number;
}

interface SinLimitePayload {
  tipoLimite: TipoMontoUIEnum.SIN_LIMITE;
}

//firmantes
export type TipoFirmaPayload = SolaFirmaPayload | FirmaConjuntaPayload;

interface SolaFirmaPayload {
  tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA;
}

interface FirmaConjuntaPayload {
  tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA;
  firmantes: Firmante[];
}
