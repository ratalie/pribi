import type { MeetingDetailsRepository } from '../../domain/ports/meeting-details.repository';
import type { MeetingDetails } from '../../domain/entities/meeting-details.entity';

/**
 * Caso de uso para obtener los detalles de la junta
 */
export class GetMeetingDetailsUseCase {
  constructor(private readonly repository: MeetingDetailsRepository) {}

  /**
   * Ejecuta la obtención de los detalles de la junta
   * @param societyId ID de la sociedad
   * @param flowId ID del flujo de junta
   * @returns Detalles de la junta o null si no existen
   */
  async execute(societyId: number, flowId: number): Promise<MeetingDetails | null> {
    return this.repository.get(societyId, flowId);
  }
}

