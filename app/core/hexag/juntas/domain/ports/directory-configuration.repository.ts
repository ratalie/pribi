import type {
  DirectoryConfigurationResponseDTO,
  UpdateDirectoryConfigurationDTO,
} from "../../application/dtos/directory-configuration.dto";

/**
 * Puerto (contrato) para el repositorio de Configuración de Directorio en Juntas
 *
 * ⚠️ IMPORTANTE: Estos endpoints actualizan el directorio del SNAPSHOT (no el directorio base)
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
 */
export interface DirectoryConfigurationRepository {
  /**
   * Obtener configuración de directorio del snapshot
   * GET /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
   */
  get(societyId: number, flowId: number): Promise<DirectoryConfigurationResponseDTO>;

  /**
   * Actualizar configuración de directorio del snapshot
   * PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
   *
   * ⚠️ Todos los campos son opcionales - Solo se envían los campos que se necesiten actualizar
   */
  update(
    societyId: number,
    flowId: number,
    dto: UpdateDirectoryConfigurationDTO
  ): Promise<void>;
}
