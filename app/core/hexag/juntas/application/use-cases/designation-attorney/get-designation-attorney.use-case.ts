import type { DesignationAttorneyRepository } from "../../../domain/ports/designation-attorney.repository";
import type { DesignationAttorneyResponseDTO } from "../../dtos/designation-attorney.dto";

/**
 * Caso de uso: Obtener Apoderado Designado
 *
 * Implementa la lógica de negocio para obtener
 * apoderados designados en el flujo de nombramiento
 */
export class GetDesignationAttorneyUseCase {
  constructor(private readonly repository: DesignationAttorneyRepository) {}

  /**
   * Ejecutar: Listar apoderados designados
   * GET /designation-attorney
   * Retorna lista de apoderados designados (puede estar vacía si es un nuevo nombramiento)
   */
  async execute(
    societyId: number,
    flowId: number
  ): Promise<DesignationAttorneyResponseDTO[]> {
    return await this.repository.list(societyId, flowId);
  }
}



