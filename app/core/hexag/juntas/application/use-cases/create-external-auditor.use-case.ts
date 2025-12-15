import type { ExternalAuditorRepository } from "../../domain/ports/external-auditor.repository";
import type { ExternalAuditorDTO } from "../dtos/external-auditor.dto";

/**
 * Caso de uso: Crear External Auditor
 *
 * Implementa la lógica de negocio para crear
 * una nueva designación de auditor externo
 */
export class CreateExternalAuditorUseCase {
  constructor(private readonly repository: ExternalAuditorRepository) {}

  /**
   * Ejecutar: Crear designación de auditor externo
   */
  async execute(societyId: number, flowId: number, dto: ExternalAuditorDTO): Promise<void> {
    await this.repository.crear(societyId, flowId, dto);
  }
}


