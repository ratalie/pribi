import type {
  CreateRemovalAttorneyDTO,
  RemovalAttorneyResponseDTO,
  UpdateRemovalAttorneyDTO,
} from "../../application/dtos/removal-attorney.dto";

/**
 * Puerto (contrato) para el repositorio de Remoción de Apoderados
 */
export interface RemovalAttorneyRepository {
  /**
   * Listar apoderados disponibles para remoción
   * GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
   */
  list(societyId: number, flowId: number): Promise<RemovalAttorneyResponseDTO[]>;

  /**
   * Crear candidato a remoción
   * POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
   */
  createCandidate(
    societyId: number,
    flowId: number,
    dto: CreateRemovalAttorneyDTO
  ): Promise<void>;

  /**
   * Actualizar estado de candidato
   * PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
   */
  updateCandidate(
    societyId: number,
    flowId: number,
    dto: UpdateRemovalAttorneyDTO
  ): Promise<void>;
}
