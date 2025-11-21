/**
 * Metadata de un archivo incluida en la respuesta del GET.
 */
export interface ArchivoMetadataDTO {
  fileId: string;
  mimeType: string;
  originalName: string;
  size: number;
}

/**
 * Estructura completa de la data en la respuesta GET de acuerdos societarios.
 */
export interface AcuerdoSocietarioDataDTO {
  derechoPreferencia: false;
  archivoEstatutos: {
    versions: ArchivoMetadataDTO[];
  } | null;
  archivoAccionistas: {
    versions: ArchivoMetadataDTO[];
  } | null;
  archivoTerceros: {
    versions: ArchivoMetadataDTO[];
  } | null;
}
