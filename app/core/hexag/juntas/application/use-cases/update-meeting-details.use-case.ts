import type { MeetingDetailsRepository } from '../../domain/ports/meeting-details.repository';
import type { MeetingDetails } from '../../domain/entities/meeting-details.entity';

/**
 * Caso de uso para actualizar los detalles de la junta
 */
export class UpdateMeetingDetailsUseCase {
  constructor(private readonly repository: MeetingDetailsRepository) {}

  /**
   * Ejecuta la actualización de los detalles de la junta
   * @param societyId ID de la sociedad
   * @param flowId ID del flujo de junta
   * @param details Detalles de la junta a actualizar
   */
  async execute(
    societyId: number,
    flowId: number,
    details: MeetingDetails
  ): Promise<void> {
    return this.repository.update(societyId, flowId, details);
  }
}

