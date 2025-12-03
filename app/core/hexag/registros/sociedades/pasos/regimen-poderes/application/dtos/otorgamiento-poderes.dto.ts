import type { TipoFirmaEnum, TipoLimiteEnum, TipoMonedaEnum } from "..";

export type OtorgamientoPoderDTO = BaseOtorgamientoPoder & ReglaMonetaria;

interface BaseOtorgamientoPoder {
  id: string;
  poderId: string;
  claseApoderadoId: string;
  //falta las fechas
}

type ReglaMonetaria = ConReglasMonetarias | SinReglasMonetarias;

interface ConReglasMonetarias {
  tieneReglasMonetarias: true;
  reglasMonetarias: ReglaMonetariaDTO[];
}

interface SinReglasMonetarias {
  tieneReglasMonetarias: false;
}

export type ReglaMonetariaDTO = BaseReglaMonetaria & LimiteMonetario & TipoFirma;

interface BaseReglaMonetaria {
  id: string;
  tipoMoneda: TipoMonedaEnum;
  montoDesde: number;
  tipoFirma: TipoFirmaEnum;
  signers?: SignerDTO[];
}

//tipos de limite monetario: tipando datos correctos
type LimiteMonetario = ConLimite | SinLimite;

interface ConLimite {
  tipoLimite: TipoLimiteEnum.MONTO;
  montoHasta: number;
}

interface SinLimite {
  tipoLimite: TipoLimiteEnum.SIN_LIMITE;
}

//tipos de firma: tipando datos correctos
type TipoFirma = SolaFirma | FirmaConjunta;

interface SolaFirma {
  tipoFirma: TipoFirmaEnum.SOLA_FIRMA;
}

interface FirmaConjunta {
  tipoFirma: TipoFirmaEnum.FIRMA_CONJUNTA;
  signers: SignerDTO[];
}

export interface SignerDTO {
  id: string;
  claseApoderadoId: string;
  cantidadMiembros: number;
}
