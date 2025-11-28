import type { TipoAccionEnum } from "../../domain/enums/tipo-accion.enum";
import type { FileMetadataDTO } from "./file-metadata.dto";

/**
 * Estructura completa de la data en la respuesta GET de acciones.
 */
export interface AccionDataResponseDTO {
  datos: AccionResponseDTO[];
  paginacion: PaginacionResponseDTO;
}

interface PaginacionResponseDTO {
  siguienteCursor?: string;
  tieneSiguientePagina: boolean;
  cantidad: number;
}

export interface AccionResponseDTO {
  id: string;
  tipo: TipoAccionEnum;
  nombre?: string; // Solo presente si tipo es 'CLASES'
  cantidadSuscrita: number;
  redimible: boolean;
  conDerechoVoto: boolean;
  archivoOtrosDerechos?: FileMetadataDTO[];
  archivoObligaciones?: FileMetadataDTO[];
  comentariosAdicionales?: string;
}
