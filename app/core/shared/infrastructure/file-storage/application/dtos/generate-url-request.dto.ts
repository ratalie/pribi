/**
 * DTO de request para generar URLs de archivos.
 */
export interface GenerateFileUrlRequestDTO {
  files: Array<{
    fileId: string;
    version: number;
  }>;
}
