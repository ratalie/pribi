import type { ExternalAuditorRepository } from "../../domain/ports/external-auditor.repository";
import type { ExternalAuditorDTO } from "../dtos/external-auditor.dto";

/**
 * Caso de uso: Actualizar External Auditor
 *
 * Implementa la lógica de negocio para actualizar
 * una designación de auditor externo existente
 */
export class UpdateExternalAuditorUseCase {
  constructor(private readonly repository: ExternalAuditorRepository) {}

  /**
   * Ejecutar: Actualizar designación de auditor externo
   */
  async execute(societyId: number, flowId: number, dto: ExternalAuditorDTO): Promise<void> {
    await this.repository.actualizar(societyId, flowId, dto);
  }
}

