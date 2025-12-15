import type { ExternalAuditorDTO } from "../../application/dtos/external-auditor.dto";

/**
 * Repository port para External Auditor
 *
 * Define el contrato para guardar, obtener y actualizar
 * la designación de auditores externos
 */
export interface ExternalAuditorRepository {
  /**
   * Crear designación de auditor externo
   */
  crear(societyId: number, flowId: number, dto: ExternalAuditorDTO): Promise<void>;

  /**
   * Obtener designación de auditor externo
   */
  obtener(societyId: number, flowId: number): Promise<ExternalAuditorDTO | null>;

  /**
   * Actualizar designación de auditor externo
   */
  actualizar(societyId: number, flowId: number, dto: ExternalAuditorDTO): Promise<void>;
}


