import type { ApplicationOfResultsRepository } from "../../domain/ports/application-of-results.repository";
import type { ApplicationOfResultsDTO } from "../dtos/application-of-results.dto";

/**
 * Caso de uso: Actualizar Application of Results
 * 
 * Implementa la lógica de negocio para actualizar
 * una aplicación de resultados existente
 */
export class UpdateApplicationOfResultsUseCase {
  constructor(
    private readonly repository: ApplicationOfResultsRepository
  ) {}

  /**
   * Ejecutar: Actualizar aplicación de resultados
   */
  async execute(
    societyId: number,
    flowId: number,
    dto: ApplicationOfResultsDTO
  ): Promise<void> {
    await this.repository.actualizar(societyId, flowId, dto);
  }
}


