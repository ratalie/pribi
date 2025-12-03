import type { TipoFirmaEnum, TipoLimiteEnum, TipoMonedaEnum } from "../..";

export interface BaseOtorgamientoPoder {
  id: string;
  poderId: string;
  claseApoderadoId: string;
  esIrrevocable: boolean;
  fechaInicio: Date;
  fechaFin?: Date;
}

export interface BaseReglaMonetaria {
  id: string;
  tipoMoneda: TipoMonedaEnum;
  montoDesde: number;
}

//tipos de limite monetario: tipando datos correctos
export type LimiteMonetarioDTO = ConLimite | SinLimite;

interface ConLimite {
  tipoLimite: TipoLimiteEnum.MONTO;
  montoHasta: number;
}

interface SinLimite {
  tipoLimite: TipoLimiteEnum.SIN_LIMITE;
}

//firmantes
export type TipoFirmaDTO = SolaFirma | FirmaConjunta;

interface SolaFirma {
  tipoFirma: TipoFirmaEnum.SOLA_FIRMA;
}

interface FirmaConjunta {
  tipoFirma: TipoFirmaEnum.FIRMA_CONJUNTA;
  firmantes: FirmantesDTO[];
}

export interface FirmantesDTO {
  id: string;
  claseApoderadoId: string;
  cantidadMiembros: number;
}
