import type { Shareholder } from '../../application/dtos/snapshot-complete.dto';

/**
 * Entidad de Asistencia
 * Representa un registro de asistencia de un accionista a la junta
 */
export interface Asistencia {
  /** UUID del registro de asistencia */
  id: string;
  
  /** UUID del meetingConfigId */
  configJuntaId: string;
  
  /** Datos del accionista (del snapshot) */
  accionista: Shareholder;
  
  /** Cantidad de acciones con derecho a voto (calculado del snapshot) */
  accionesConDerechoVoto: number;
  
  /** Porcentaje de participación (0-100) */
  porcentajeParticipacion: number;
  
  /** Si el accionista asistió a la junta */
  asistio: boolean;
  
  /** UUID del accionista que lo representa (si aplica) */
  representadoPorId: string | null;
  
  /** Si este accionista está representando a otro */
  esRepresentante: boolean;
}




