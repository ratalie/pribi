/**
 * DTOs para External Auditor
 *
 * Endpoints:
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/external-auditors
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/external-auditors
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/external-auditors
 */

/**
 * DTO para Auditor Externo (nested object)
 */
export interface AuditorExternoDTO {
  nombreCompleto: string;
}

/**
 * DTO Request/Response para External Auditor
 *
 * Según documentación del backend, el mismo formato se usa para POST, PUT y GET
 */
export interface ExternalAuditorDTO {
  responsableDesignacion: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO";
  auditorExterno?: AuditorExternoDTO; // Opcional: solo si responsableDesignacion es JUNTA_DE_ACCIONISTAS
}

/**
 * DTO Response del backend
 */
export interface ExternalAuditorResponseDTO {
  success: boolean;
  message: string;
  data?: ExternalAuditorDTO;
  code: number;
}


