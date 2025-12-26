import type { DesignationAttorneyRepository } from "../../../domain/ports/designation-attorney.repository";
import type { CreateDesignationAttorneyDTO } from "../../dtos/designation-attorney.dto";

/**
 * Caso de uso: Crear Apoderado Designado (Nombramiento)
 *
 * Implementa la lógica de negocio para crear
 * un nuevo apoderado en el flujo de nombramiento
 */
export class CreateDesignationAttorneyUseCase {
  constructor(private readonly repository: DesignationAttorneyRepository) {}

  /**
   * Ejecutar: Crear nuevo apoderado designado
   * POST /designation-attorney
   * Crea nuevo apoderado y AttorneyFlowAction con candidateStatus: CANDIDATE o DIRECT_APPOINTED
   */
  async execute(
    societyId: number,
    flowId: number,
    dto: CreateDesignationAttorneyDTO
  ): Promise<void> {
    return await this.repository.create(societyId, flowId, dto);
  }
}



