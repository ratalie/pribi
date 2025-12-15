import type { ApplicationOfResultsRepository } from "../../domain/ports/application-of-results.repository";
import type { ApplicationOfResultsDTO } from "../dtos/application-of-results.dto";

/**
 * Caso de uso: Crear Application of Results
 * 
 * Implementa la lógica de negocio para crear
 * una nueva aplicación de resultados
 */
export class CreateApplicationOfResultsUseCase {
  constructor(
    private readonly repository: ApplicationOfResultsRepository
  ) {}

  /**
   * Ejecutar: Crear aplicación de resultados
   */
  async execute(
    societyId: number,
    flowId: number,
    dto: ApplicationOfResultsDTO
  ): Promise<void> {
    await this.repository.crear(societyId, flowId, dto);
  }
}

