import type {
  CreateFinancialReportDocumentRequestDTO,
  UpdateFinancialReportDocumentRequestDTO,
  FinancialReportDocumentResponseDTO,
} from "../../application/dtos/financial-report-document.dto";

/**
 * Repository port para Financial Report Document
 * 
 * Define el contrato para guardar, obtener y actualizar
 * reportes financieros (memoria anual y estados financieros)
 */
export interface FinancialReportDocumentRepository {
  /**
   * Crear reporte financiero
   */
  crear(
    societyId: number,
    flowId: number,
    dto: CreateFinancialReportDocumentRequestDTO
  ): Promise<void>;

  /**
   * Obtener reporte financiero
   */
  obtener(
    societyId: number,
    flowId: number
  ): Promise<FinancialReportDocumentResponseDTO | null>;

  /**
   * Actualizar reporte financiero
   */
  actualizar(
    societyId: number,
    flowId: number,
    dto: UpdateFinancialReportDocumentRequestDTO
  ): Promise<void>;
}


