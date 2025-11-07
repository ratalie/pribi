import type { EntityCoinEnum } from "~/types/enums/EntityCoinEnum";
import type { TiemposVigenciaEnum } from "~/types/enums/TiemposVigenciaEnum";
import type { TipoFirmasEnum } from "~/types/enums/TipoFirmasEnum";
import type { TipoMontoEnum } from "~/types/enums/TipoMontoEnum";

export interface ApoderadoFacultad {
  id: string;
  nombre: string;
  facultades: Facultad[];
}

export type Facultad = BaseFacultad & TipoVigencia & TipoReglas;

interface BaseFacultad {
  id: string;
  nombre: string;
}

type TipoVigencia = VigenciaIndefinida | VigenciaDeterminada;

interface VigenciaIndefinida {
  esIrrevocable: true;
  vigencia: TiemposVigenciaEnum.INDEFINIDO;
}

interface VigenciaDeterminada {
  esIrrevocable: false;
  vigencia: TiemposVigenciaEnum.DETERMIADO;
  fecha_inicio: string;
  fecha_fin: string;
}

type TipoReglas = SinReglasYLimites | ConReglasYLimites;

interface SinReglasYLimites {
  reglasYLimites: false;
}

interface ConReglasYLimites {
  reglasYLimites: true;
  tipoMoneda: EntityCoinEnum;
  limiteMonetario: LimiteMonetario[];
}

type LimiteMonetario = BaseLimiteMonetario & (SolaFirma | FirmaConjunta);

interface BaseLimiteMonetario {
  id: string;
  desde: number;
  tipoMonto: TipoMontoEnum;
  hasta: number;
}

interface SolaFirma {
  tipoFirma: TipoFirmasEnum.SOLA_FIRMA;
}

interface FirmaConjunta {
  tipoFirma: TipoFirmasEnum.FIRMA_CONJUNTA;
  firmantes: Firmante[];
}

interface Firmante {
  id: string;
  cantidad: number;
  grupo: string;
}

// Tabla de Apoderados Facultades

export interface ApoderadoFacultadRow {
  id: string;
  nombre: string;
  facultades: FacultadRow[];
}

export interface FacultadRow {
  id: string;
  facultad: string;
  vigencia: string;
  reglas_firma: number;
  reglas_y_limites: ReglasYLimitesRow[];
}

interface ReglasYLimitesRow {
  id: string;
  table_id: number;
  desde: string;
  hasta: string;
  tipo_firma: TipoFirmasEnum;
  firmantes: Firmante[];
}
