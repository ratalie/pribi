import type { TipoAccionesEnum } from "./enums/tipoAccionesEnum";
export interface AccionRegistro {
  id: string;
  tipo: TipoAccionesEnum;
  nombreAccion: string;
  accionesSuscritas: number;
  derechoVoto: boolean;
  redimibles: boolean;
  otrosDerechosEspeciales: boolean;
  metadataDerechosEspeciales: FileMetadataDTO[];
  obligacionesAdicionales: boolean;
  metadataObligaciones: FileMetadataDTO[];
  comentariosAdicionales: boolean;
  comentariosAdicionalesTexto: string;
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

export interface FileMetadataDTO {
  fileId: string;
  mimeType: string;
  originalName: string;
  size: number;
}
