import type {
  Firmante,
  TipoFirmasUIEnum,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";

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
  tipo_firma: TipoFirmasUIEnum;
  firmantes: Firmante[];
}
