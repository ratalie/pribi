import type { TipoAccionEnum } from "../enums/tipo-accion.enum";
import type { FileMetadata } from "./file-metadata.entity";
/**
 * Entidad de dominio que representa una acción.
 */
export interface Accion {
  id: string;
  tipo: TipoAccionEnum;
  nombreAccion: string;
  accionesSuscritas: number;
  derechoVoto: boolean;
  redimibles: boolean;
  otrosDerechosEspeciales: boolean;
  metadataDerechosEspeciales: FileMetadata[];
  obligacionesAdicionales: boolean;
  metadataObligaciones: FileMetadata[];
  comentariosAdicionales: boolean;
  comentariosAdicionalesTexto: string;
}
