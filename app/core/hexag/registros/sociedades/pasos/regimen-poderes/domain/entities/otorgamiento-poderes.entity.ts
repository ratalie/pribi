import type {
  EntityCoinUIEnum,
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  TipoMontoUIEnum,
} from "..";

export interface ApoderadoFacultad {
  id: string;
  claseApoderadoId: string;
  claseApoderadoNombre: string;
  facultades: Facultad[];
}

export type Facultad = BaseFacultad & TipoVigencia & TipoReglas;

interface BaseFacultad {
  id: string;
  tipoFacultadId: string;
  tipoFacultadNombre: string;
}

type TipoVigencia = VigenciaIndefinida | VigenciaDeterminada;

interface VigenciaIndefinida {
  esIrrevocable: false;
  vigencia: TiempoVigenciaUIEnum.INDEFINIDO;
}

interface VigenciaDeterminada {
  esIrrevocable: true;
  vigencia: TiempoVigenciaUIEnum.DETERMIADO;
  fecha_inicio: string;
  fecha_fin: string;
}

type TipoReglas = SinReglasYLimites | ConReglasYLimites;

interface SinReglasYLimites {
  reglasYLimites: false;
}

interface ConReglasYLimites {
  reglasYLimites: true;
  tipoMoneda: EntityCoinUIEnum;
  limiteMonetario: LimiteMonetario[];
}

type LimiteMonetario = BaseLimiteMonetario & (SolaFirma | FirmaConjunta);

interface BaseLimiteMonetario {
  id: string;
  desde: number;
  tipoMonto: TipoMontoUIEnum;
  hasta: number;
}

interface SolaFirma {
  tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA;
}

interface FirmaConjunta {
  tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA;
  firmantes: Firmante[];
}

export interface Firmante {
  id: string;
  cantidad: number;
  grupo: string;
}
