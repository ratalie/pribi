import type { ExternalAuditorRepository } from "../../domain/ports/external-auditor.repository";
import type { ExternalAuditorDTO } from "../dtos/external-auditor.dto";

/**
 * Caso de uso: Guardar External Auditor
 *
 * Implementa la lógica de negocio para crear o actualizar
 * una designación de auditor externo (crea si no existe, actualiza si existe)
 */
export class SaveExternalAuditorUseCase {
  constructor(private readonly repository: ExternalAuditorRepository) {}

  /**
   * Ejecutar: Crear o actualizar designación de auditor externo
   *
   * Si ya existe, actualiza; si no, crea uno nuevo
   */
  async execute(societyId: number, flowId: number, dto: ExternalAuditorDTO): Promise<void> {
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


