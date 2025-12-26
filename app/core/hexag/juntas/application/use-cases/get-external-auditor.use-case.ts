import type { ExternalAuditorRepository } from "../../domain/ports/external-auditor.repository";
import type { ExternalAuditorDTO } from "../dtos/external-auditor.dto";

/**
 * Caso de uso: Obtener External Auditor
 *
 * Implementa la lógica de negocio para obtener
 * una designación de auditor externo existente
 */
export class GetExternalAuditorUseCase {
  constructor(private readonly repository: ExternalAuditorRepository) {}

  /**
   * Ejecutar: Obtener designación de auditor externo
   */
  async execute(societyId: number, flowId: number): Promise<ExternalAuditorDTO | null> {
    return await this.repository.obtener(societyId, flowId);
  }
}


