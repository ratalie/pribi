import type { CreditCapitalizationRepository } from "../../../domain/ports/credit-capitalization.repository";
import type { CreditCapitalization } from "../../../domain/entities/credit-capitalization.entity";

/**
 * Caso de uso: Listar Capitalizaciones
 *
 * Implementa la lógica de negocio para obtener
 * la lista de capitalizaciones registradas
 */
export class ListCapitalizationsUseCase {
  constructor(private readonly repository: CreditCapitalizationRepository) {}

  /**
   * Ejecutar: Obtener lista de capitalizaciones
   */
  async execute(
    societyId: number,
    flowId: number
  ): Promise<CreditCapitalization[]> {
    return await this.repository.list(societyId, flowId);
  }
}



