import type { RemovalManagerRepository } from "../../../domain/ports/removal-manager.repository";
import type { RemovalManagerResponseDTO } from "../../dtos/removal-manager.dto";

/**
 * Caso de uso: Obtener gerente general para remoción
 * 
 * Nota: Remoción de gerente no tiene endpoints específicos de backend.
 * Este caso de uso existe para mantener consistencia arquitectónica.
 */
export class GetManagerUseCase {
  constructor(private readonly repository: RemovalManagerRepository) {}

  async execute(
    societyId: number,
    flowId: number
  ): Promise<RemovalManagerResponseDTO | null> {
    return await this.repository.getManager(societyId, flowId);
  }
}



