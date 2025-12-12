import type { FinancialReportDocumentRepository } from "../../domain/ports/financial-report-document.repository";
import type { FinancialReportDocumentResponseDTO } from "../dtos/financial-report-document.dto";

/**
 * Caso de uso: Obtener Financial Report Document
 * 
 * Implementa la lógica de negocio para obtener
 * un reporte financiero existente
 */
export class ObtenerFinancialReportDocumentUseCase {
  constructor(
    private readonly repository: FinancialReportDocumentRepository
  ) {}

  /**
   * Ejecutar: Obtener reporte financiero
   */
  async ejecutar(
    societyId: number,
    flowId: number
  ): Promise<FinancialReportDocumentResponseDTO | null> {
    return await this.repository.obtener(societyId, flowId);
  }
}


