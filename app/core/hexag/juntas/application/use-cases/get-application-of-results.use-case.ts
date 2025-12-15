import type { ApplicationOfResultsRepository } from "../../domain/ports/application-of-results.repository";
import type { ApplicationOfResultsDTO } from "../dtos/application-of-results.dto";

/**
 * Caso de uso: Obtener Application of Results
 * 
 * Implementa la lógica de negocio para obtener
 * una aplicación de resultados existente
 */
export class GetApplicationOfResultsUseCase {
  constructor(
    private readonly repository: ApplicationOfResultsRepository
  ) {}

  /**
   * Ejecutar: Obtener aplicación de resultados
   */
  async execute(
    societyId: number,
    flowId: number
  ): Promise<ApplicationOfResultsDTO | null> {
    return await this.repository.obtener(societyId, flowId);
  }
}


