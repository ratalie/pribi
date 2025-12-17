import type { CreditCapitalizationRepository } from "../../../domain/ports/credit-capitalization.repository";
import type { CreateCreditCapitalizationDTO } from "../../../domain/ports/credit-capitalization.repository";
import type { CreditCapitalization } from "../../../domain/entities/credit-capitalization.entity";

/**
 * Caso de uso: Crear Capitalización
 *
 * Implementa la lógica de negocio para crear
 * una nueva capitalización de crédito
 */
export class CreateCapitalizationUseCase {
  constructor(private readonly repository: CreditCapitalizationRepository) {}

  /**
   * Ejecutar: Crear nueva capitalización
   */
  async execute(
    societyId: number,
    flowId: number,
    dto: CreateCreditCapitalizationDTO
  ): Promise<CreditCapitalization> {
    return await this.repository.create(societyId, flowId, dto);
  }
}





