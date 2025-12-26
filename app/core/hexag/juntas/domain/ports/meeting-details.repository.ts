import type { MeetingDetails } from '../entities/meeting-details.entity';

/**
 * Puerto (contrato) para el repositorio de detalles de junta
 */
export interface MeetingDetailsRepository {
  /**
   * Obtiene los detalles de la junta
   */
  get(societyId: number, flowId: number): Promise<MeetingDetails | null>;

  /**
   * Actualiza los detalles de la junta
   */
  update(societyId: number, flowId: number, details: MeetingDetails): Promise<void>;
}

