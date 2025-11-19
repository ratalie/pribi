import type { BackendApiResponse } from "~/core/shared/http/api-response.types";

/**
 * DTO que representa la data específica de la respuesta al subir un archivo.
 */
export interface UploadFileDataDTO {
  fileId: string;
  versionId: string;
  provider: string;
  size: number;
  mimeType: string;
  originalName: string;
}

/**
 * DTO de response para la operación de subir archivo.
 * Usa la estructura genérica del backend con el tipo específico de data.
 */
export type UploadFileResponseDTO = BackendApiResponse<UploadFileDataDTO>;
