import type { RemovalDirectorRepository } from "../../../domain/ports/removal-director.repository";
import type { RemovalDirectorResponseDTO } from "../../dtos/removal-director.dto";

/**
 * Caso de uso: Listar Directores para Remoción
 *
 * Implementa la lógica de negocio para obtener
 * la lista de directores disponibles para remoción
 */
export class ListRemovalDirectorsUseCase {
  constructor(private readonly repository: RemovalDirectorRepository) {}

  /**
   * Ejecutar: Obtener lista de directores disponibles para remoción
   */
  async execute(
    societyId: number,
    flowId: number
  ): Promise<RemovalDirectorResponseDTO[]> {
    return await this.repository.list(societyId, flowId);
  }
}

