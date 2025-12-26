import type { CreditorRepository } from "../../../domain/ports/creditor.repository";

/**
 * Caso de uso: Eliminar Acreedores
 *
 * Implementa la lógica de negocio para eliminar
 * uno o más acreedores
 */
export class DeleteCreditorUseCase {
  constructor(private readonly repository: CreditorRepository) {}

  /**
   * Ejecutar: Eliminar acreedores
   */
  async execute(
    societyId: number,
    flowId: number,
    creditorIds: string[]
  ): Promise<void> {
    return await this.repository.delete(societyId, flowId, creditorIds);
  }
}





