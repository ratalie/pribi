export type TipoAccionRegistro = "comun" | "clase";

export interface AccionRegistro {
  id: string;
  tipo: TipoAccionRegistro;
  descripcion: string;
  accionesSuscritas: number;
  derechoVoto: boolean;
  redimibles: boolean;
  derechosEspeciales: boolean;
  obligacionesAdicionales: boolean;
  archivosDerechosEspeciales: File[];
  archivosObligaciones: File[];
  participacion: number;
}

export interface AccionTableRow {
  id: string;
  tipo_acciones: string;
  acciones_suscritas: number;
  participacion: string;
  derecho_voto: boolean;
  redimibles: boolean;
  derechos_especiales: boolean;
  obligaciones_adicionales: boolean;
}
