import type { TipoAccionEnum } from "../../domain/enums/tipo-accion.enum";

/**
 * DTO para crear o actualizar una acción.
 * Se usa tanto para POST como para PUT.
 */
export interface AccionDTO {
  id: string;
  tipo: TipoAccionEnum;
  nombre?: string; // Solo presente si tipo es 'CLASES'
  cantidadSuscrita: number;
  redimible: boolean;
  conDerechoVoto: boolean;
  archivoOtrosDerechos?: string[]; // UUID opcional de los archivos
  archivoObligaciones?: string[]; // UUID opcional de los archivos
  comentariosAdicionales?: string;
}
