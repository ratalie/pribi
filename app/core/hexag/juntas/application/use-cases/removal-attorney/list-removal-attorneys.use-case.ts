import type { RemovalAttorneyRepository } from "../../../domain/ports/removal-attorney.repository";
import type { RemovalAttorneyResponseDTO } from "../../dtos/removal-attorney.dto";

/**
 * Caso de uso: Listar Apoderados para Remoción
 *
 * Implementa la lógica de negocio para obtener
 * la lista de apoderados disponibles para remoción
 */
export class ListRemovalAttorneysUseCase {
  constructor(private readonly repository: RemovalAttorneyRepository) {}

  /**
   * Ejecutar: Obtener lista de apoderados disponibles para remoción
   */
  async execute(
    societyId: number,
    flowId: number
  ): Promise<RemovalAttorneyResponseDTO[]> {
    return await this.repository.list(societyId, flowId);
  }
}

