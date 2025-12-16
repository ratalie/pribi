import type { RemovalDirectorRepository } from "../../../domain/ports/removal-director.repository";
import type { UpdateRemovalDirectorDTO } from "../../dtos/removal-director.dto";

/**
 * Caso de uso: Actualizar Estado de Candidato a Remoción
 *
 * Implementa la lógica de negocio para actualizar
 * el estado de un candidato después de la votación
 */
export class UpdateRemovalDirectorCandidateUseCase {
  constructor(private readonly repository: RemovalDirectorRepository) {}

  /**
   * Ejecutar: Actualizar estado de candidato
   */
  async execute(
    societyId: number,
    flowId: number,
    directorId: string,
    estado: "ELEGIDO" | "NO_ELEGIDO"
  ): Promise<void> {
    const dto: UpdateRemovalDirectorDTO = {
      directorId,
      candidatoEstado: estado,
    };

    return await this.repository.updateCandidate(societyId, flowId, dto);
  }
}

