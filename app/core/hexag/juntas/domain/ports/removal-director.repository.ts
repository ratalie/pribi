import type {
  CreateRemovalDirectorDTO,
  RemovalDirectorResponseDTO,
  UpdateRemovalDirectorDTO,
} from "../../application/dtos/removal-director.dto";

/**
 * Puerto (contrato) para el repositorio de Remoción de Directores
 */
export interface RemovalDirectorRepository {
  /**
   * Listar directores disponibles para remoción
   * GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
   */
  list(societyId: number, flowId: number): Promise<RemovalDirectorResponseDTO[]>;

  /**
   * Crear candidato a remoción
   * POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
   */
  createCandidate(
    societyId: number,
    flowId: number,
    dto: CreateRemovalDirectorDTO
  ): Promise<void>;

  /**
   * Actualizar estado de candidato
   * PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
   */
  updateCandidate(
    societyId: number,
    flowId: number,
    dto: UpdateRemovalDirectorDTO
  ): Promise<void>;
}

