/**
 * DTO para crear o actualizar acuerdos societarios.
 * Se usa tanto para POST como para PUT.
 */
export interface AcuerdoSocietarioDTO {
  derechoPreferencia: boolean;
  archivoEstatutos: string | null; // UUID del archivo subido
  archivoAccionistas: string | null; // UUID del archivo subido
  archivoTerceros: string | null; // UUID del archivo subido
}

