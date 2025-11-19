/**
 * Metadata de un archivo incluida en la respuesta del GET.
 */
export interface ArchivoMetadataDTO {
  id: string;
  nombre: string;
  url: string;
}

/**
 * Estructura completa de la data en la respuesta GET de acuerdos societarios.
 */
export interface AcuerdoSocietarioDataDTO {
  id: string;
  derechoPreferencia: boolean;
  archivoEstatutos: string | null;
  archivoAccionistas: string | null;
  archivoTerceros: string | null;
  estatutos: ArchivoMetadataDTO | null;
  accionistas: ArchivoMetadataDTO | null;
  terceros: ArchivoMetadataDTO | null;
}
