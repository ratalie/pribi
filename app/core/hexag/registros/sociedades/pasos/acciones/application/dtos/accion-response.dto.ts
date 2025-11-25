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
  tipo: "COMUN" | "CLASE";
  nombre?: string; // Solo presente si tipo es 'CLASE'
  cantidadSuscrita: number;
  redimible: boolean;
  conDerechoVoto: boolean;
  otrosDerechosEspeciales: boolean;
  archivoOtrosDerechos?: FileMetadataResponseDTO;
  regimenObligacionesAdicionales: boolean;
  archivoObligaciones?: FileMetadataResponseDTO;
}

interface FileMetadataResponseDTO {
  fileId: string;
  mimeType: string;
  originalName: string;
  size: number;
}
