import type {
  BaseOtorgamientoPoderCreate,
  BaseReglaMonetaria,
  LimiteMonetarioDTO,
  TipoFirmaDTO,
} from "./base.dto";

export type CreateOtorgamientoPoderDTO = BaseOtorgamientoPoderCreate & ReglaMonetaria;

//reglas monetarias
type ReglaMonetaria = ConReglasMonetarias | SinReglasMonetarias;

interface ConReglasMonetarias {
  tieneReglasFirma: true;
  reglasMonetarias: CreateReglaMonetariaDTO[];
}

interface SinReglasMonetarias {
  tieneReglasFirma: false;
}

export type CreateReglaMonetariaDTO = BaseReglaMonetaria & LimiteMonetarioDTO & TipoFirmaDTO;
