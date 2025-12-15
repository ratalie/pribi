import type { ApplicationOfResultsRepository } from "../../domain/ports/application-of-results.repository";
import type { ApplicationOfResultsDTO } from "../dtos/application-of-results.dto";

/**
 * Caso de uso: Guardar Application of Results
 * 
 * Implementa la lógica de negocio para crear o actualizar
 * una aplicación de resultados (crea si no existe, actualiza si existe)
 */
export class SaveApplicationOfResultsUseCase {
  constructor(
    private readonly repository: ApplicationOfResultsRepository
  ) {}

  /**
   * Ejecutar: Crear o actualizar aplicación de resultados
   * 
   * Si ya existe, actualiza; si no, crea uno nuevo
   */
  async execute(
    societyId: number,
    flowId: number,
    dto: ApplicationOfResultsDTO
  ): Promise<void> {
    // Verificar si ya existe
    const existente = await this.repository.obtener(societyId, flowId);

    if (existente) {
      // Actualizar
      await this.repository.actualizar(societyId, flowId, dto);
    } else {
      // Crear
      await this.repository.crear(societyId, flowId, dto);
    }
  }
}

