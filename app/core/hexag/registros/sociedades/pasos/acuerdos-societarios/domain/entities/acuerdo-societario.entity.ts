/**
 * Entidad de dominio que representa los acuerdos societarios de una sociedad.
 */
export interface AcuerdoSocietario {
  derechoPreferencia: boolean;
  archivoEstatutos: string | null; // UUID del archivo subido
  archivoAccionistas: string | null; // UUID del archivo subido
  archivoTerceros: string | null; // UUID del archivo subido
  createdAt?: string;
  updatedAt?: string;
}

