import type { CreditorRepository } from "../../../domain/ports/creditor.repository";
import type { UpdateCreditorDTO } from "../../../domain/ports/creditor.repository";

/**
 * Caso de uso: Actualizar Acreedor
 *
 * Implementa la lógica de negocio para actualizar
 * un acreedor existente
 */
export class UpdateCreditorUseCase {
  constructor(private readonly repository: CreditorRepository) {}

  /**
   * Ejecutar: Actualizar acreedor
   */
  async execute(
    societyId: number,
    flowId: number,
    dto: UpdateCreditorDTO
  ): Promise<void> {
    return await this.repository.update(societyId, flowId, dto);
  }
}



