import type { BackendApiResponse } from "~/core/shared/http/api-response.types";

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

/**
 * DTO de response para todas las operaciones de acuerdos societarios.
 * El campo 'data' es opcional porque CREATE/UPDATE no lo incluyen, solo GET.
 */
export type AcuerdoSocietarioResponseDTO = Omit<
  BackendApiResponse<AcuerdoSocietarioDataDTO>,
  "data"
> & {
  data?: AcuerdoSocietarioDataDTO;
};
