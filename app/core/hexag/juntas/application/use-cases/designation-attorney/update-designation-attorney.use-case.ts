import type { DesignationAttorneyRepository } from "../../../domain/ports/designation-attorney.repository";
import type { UpdateDesignationAttorneyDTO } from "../../dtos/designation-attorney.dto";

/**
 * Caso de uso: Actualizar Apoderado Designado
 *
 * Implementa la lógica de negocio para actualizar
 * un apoderado designado en el flujo de nombramiento
 */
export class UpdateDesignationAttorneyUseCase {
  constructor(private readonly repository: DesignationAttorneyRepository) {}

  /**
   * Ejecutar: Actualizar apoderado designado
   * PUT /designation-attorney
   * Actualiza datos del apoderado o su estado
   */
  async execute(
    societyId: number,
    flowId: number,
    dto: UpdateDesignationAttorneyDTO
  ): Promise<void> {
    return await this.repository.update(societyId, flowId, dto);
  }
}



