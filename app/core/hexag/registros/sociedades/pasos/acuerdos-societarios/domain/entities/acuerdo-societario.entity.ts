/**
 * Metadata de un archivo incluida en la respuesta del GET.
 */
export interface ArchivoMetadata {
  id: string;
  nombre: string;
  size: number;
}

/**
 * Entidad de dominio que representa los acuerdos societarios de una sociedad.
 */
export interface AcuerdoSocietario {
  derechoPreferencia: boolean;
  archivoEstatutos: ArchivoMetadata | null;
  archivoAccionistas: ArchivoMetadata | null;
  archivoTerceros: ArchivoMetadata | null;
}
