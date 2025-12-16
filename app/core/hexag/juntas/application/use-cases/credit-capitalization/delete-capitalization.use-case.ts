import type { CreditCapitalizationRepository } from "../../../domain/ports/credit-capitalization.repository";

/**
 * Caso de uso: Eliminar Capitalizaciones
 *
 * Implementa la lógica de negocio para eliminar
 * una o más capitalizaciones
 */
export class DeleteCapitalizationUseCase {
  constructor(private readonly repository: CreditCapitalizationRepository) {}

  /**
   * Ejecutar: Eliminar capitalizaciones
   */
  async execute(
    societyId: number,
    flowId: number,
    capitalizationIds: string[]
  ): Promise<void> {
    return await this.repository.delete(societyId, flowId, capitalizationIds);
  }
}


