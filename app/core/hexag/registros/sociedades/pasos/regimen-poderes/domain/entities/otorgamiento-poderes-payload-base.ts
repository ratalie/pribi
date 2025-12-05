import type { EntityCoinUIEnum, TipoFirmasUIEnum, TipoMontoUIEnum } from "..";
import type { Firmante } from "./otorgamiento-poderes.entity";

export interface BaseOtorgamientoPoderPayload {
  id: string;
  poderId: string;
  claseApoderadoId: string;
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
