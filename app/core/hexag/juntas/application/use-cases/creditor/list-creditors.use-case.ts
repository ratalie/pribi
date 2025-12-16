import type { Creditor } from "../../../domain/entities/creditor.entity";
import type { CreditorRepository } from "../../../domain/ports/creditor.repository";

/**
 * Caso de uso: Listar Acreedores
 *
 * Implementa la lógica de negocio para obtener
 * la lista de acreedores registrados
 */
export class ListCreditorsUseCase {
  constructor(private readonly repository: CreditorRepository) {}

  /**
   * Ejecutar: Obtener lista de acreedores
   */
  async execute(societyId: number, flowId: number): Promise<Creditor[]> {
    return await this.repository.list(societyId, flowId);
  }
}


