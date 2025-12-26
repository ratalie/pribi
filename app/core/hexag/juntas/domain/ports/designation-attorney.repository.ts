import type {
  CreateDesignationAttorneyDTO,
  DesignationAttorneyResponseDTO,
  UpdateDesignationAttorneyDTO,
} from "../../application/dtos/designation-attorney.dto";

/**
 * Puerto (contrato) para el repositorio de Designación de Apoderados
 */
export interface DesignationAttorneyRepository {
  /**
   * Listar apoderados designados
   * GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
   */
  list(societyId: number, flowId: number): Promise<DesignationAttorneyResponseDTO[]>;

  /**
   * Crear nuevo apoderado (para nombramiento)
   * POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
   * Crea nuevo apoderado y AttorneyFlowAction con candidateStatus: CANDIDATE o DIRECT_APPOINTED
   */
  create(societyId: number, flowId: number, dto: CreateDesignationAttorneyDTO): Promise<void>;

  /**
   * Actualizar estado de apoderado designado
   * PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
   */
  update(societyId: number, flowId: number, dto: UpdateDesignationAttorneyDTO): Promise<void>;

  /**
   * Eliminar apoderado designado
   * DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney/:designationId
   */
  delete(societyId: number, flowId: number, designationId: string): Promise<void>;
}
