import type {
  CreateDesignationDirectorDTO,
  DesignationDirectorResponseDTO,
  UpdateDesignationDirectorDTO,
} from "../../application/dtos/designation-director.dto";

/**
 * Puerto (contrato) para el repositorio de Designación de Directores
 */
export interface DesignationDirectorRepository {
  /**
   * Listar directores designados
   * GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director?actionType=DESIGNATION
   */
  list(societyId: number, flowId: number): Promise<DesignationDirectorResponseDTO[]>;

  /**
   * Crear nuevo director (para nombramiento)
   * POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
   * Crea nuevo director y DirectorFlowAction con candidateStatus: CANDIDATO o DESIGNADO_DIRECTAMENTE
   */
  create(societyId: number, flowId: number, dto: CreateDesignationDirectorDTO): Promise<void>;

  /**
   * Actualizar estado de director designado
   * PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
   */
  update(societyId: number, flowId: number, dto: UpdateDesignationDirectorDTO): Promise<void>;

  /**
   * Eliminar director designado
   * DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director/:designationId
   */
  delete(societyId: number, flowId: number, designationId: string): Promise<void>;
}
