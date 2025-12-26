import type { Documento } from "../../domain/entities/documento.entity";

/**
 * DTO de respuesta para un documento generado
 */
export interface DocumentoResponseDTO {
  id: string;
  nombre: string;
  blob: Blob;
  mimeType: string;
  tamano: number;
  tamanoLegible: string;
  categoria: string;
  puntoAcuerdoId?: string;
}

/**
 * Mapea entidad Documento a DTO
 */
export function documentoToDto(documento: Documento): DocumentoResponseDTO {
  return {
    id: documento.id,
    nombre: documento.nombre,
    blob: documento.blob,
    mimeType: documento.mimeType,
    tamano: documento.tamano,
    tamanoLegible: documento.tamanoLegible,
    categoria: documento.categoria,
    puntoAcuerdoId: documento.puntoAcuerdoId,
  };
}

