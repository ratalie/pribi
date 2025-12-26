import type { TipoJunta } from '../enums/tipo-junta.enum';
import type { OrdenConvocatoria } from '../enums/orden-convocatoria.enum';
import type { Convocatoria } from './convocatoria.entity';

/**
 * Entidad de dominio que representa los detalles completos de una junta
 */
export interface MeetingDetails {
  id?: string; // UUID del meetingConfigId (del snapshot)
  tipoJunta: TipoJunta;
  esAnualObligatoria: boolean;
  primeraConvocatoria?: Convocatoria;
  segundaConvocatoria?: Convocatoria;
  instaladaEnConvocatoria?: OrdenConvocatoria; // Solo para General
  presidenteId?: string;
  secretarioId?: string;
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  nombreOtroPresidente?: string;
  nombreOtroSecretario?: string;
  juntaNombrada: boolean;
  nombreJunta?: string;
}

