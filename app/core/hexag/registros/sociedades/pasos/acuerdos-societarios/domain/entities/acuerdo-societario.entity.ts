/**
 * Metadata de un archivo incluida en la respuesta del GET.
 */
export interface ArchivoMetadata {
  id: string;
  nombre: string;
  url: string;
}

/**
 * Entidad de dominio que representa los acuerdos societarios de una sociedad.
 */
export interface AcuerdoSocietario {
  id?: string;
  derechoPreferencia: boolean;
  archivoEstatutos: string | null; // UUID del archivo subido
  archivoAccionistas: string | null; // UUID del archivo subido
  archivoTerceros: string | null; // UUID del archivo subido
  estatutos: ArchivoMetadata | null; // Metadata del archivo (solo en GET)
  accionistas: ArchivoMetadata | null; // Metadata del archivo (solo en GET)
  terceros: ArchivoMetadata | null; // Metadata del archivo (solo en GET)
}
