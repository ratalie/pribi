import type { RemovalAttorneyRepository } from "../../../domain/ports/removal-attorney.repository";
import type { UpdateRemovalAttorneyDTO } from "../../dtos/removal-attorney.dto";

/**
 * Caso de uso: Actualizar Estado de Candidato a Remoción
 *
 * Implementa la lógica de negocio para actualizar
 * el estado de un candidato después de la votación
 */
export class UpdateRemovalAttorneyCandidateUseCase {
  constructor(private readonly repository: RemovalAttorneyRepository) {}

  /**
   * Ejecutar: Actualizar estado de candidato
   */
  async execute(
    societyId: number,
    flowId: number,
    attorneyId: string,
    estado: "ELEGIDO" | "NO_ELEGIDO"
  ): Promise<void> {
    const dto: UpdateRemovalAttorneyDTO = {
      attorneyId,
      candidatoEstado: estado,
    };

    return await this.repository.updateCandidate(societyId, flowId, dto);
  }
}

