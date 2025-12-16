import type {
  CreditCapitalizationRepository,
  UpdateCreditCapitalizationDTO,
} from "../../../domain/ports/credit-capitalization.repository";

/**
 * Caso de uso: Actualizar Capitalización
 *
 * Implementa la lógica de negocio para actualizar
 * una capitalización existente
 */
export class UpdateCapitalizationUseCase {
  constructor(private readonly repository: CreditCapitalizationRepository) {}

  /**
   * Ejecutar: Actualizar capitalización
   */
  async execute(
    societyId: number,
    flowId: number,
    dto: UpdateCreditCapitalizationDTO
  ): Promise<void> {
    return await this.repository.update(societyId, flowId, dto);
  }
}

