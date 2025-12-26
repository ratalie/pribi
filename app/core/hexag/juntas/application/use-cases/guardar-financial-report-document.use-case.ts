import type { FinancialReportDocumentRepository } from "../../domain/ports/financial-report-document.repository";
import type {
  CreateFinancialReportDocumentRequestDTO,
  UpdateFinancialReportDocumentRequestDTO,
} from "../dtos/financial-report-document.dto";

/**
 * Caso de uso: Guardar Financial Report Document
 * 
 * Implementa la lógica de negocio para crear o actualizar
 * un reporte financiero (memoria anual + estados financieros)
 */
export class GuardarFinancialReportDocumentUseCase {
  constructor(
    private readonly repository: FinancialReportDocumentRepository
  ) {}

  /**
   * Ejecutar: Crear o actualizar reporte financiero
   * 
   * Si ya existe, actualiza; si no, crea uno nuevo
   */
  async ejecutar(
    societyId: number,
    flowId: number,
    dto: CreateFinancialReportDocumentRequestDTO | UpdateFinancialReportDocumentRequestDTO
  ): Promise<void> {
    // Verificar si ya existe
    const existente = await this.repository.obtener(societyId, flowId);

    if (existente) {
      // Actualizar
      await this.repository.actualizar(
        societyId,
        flowId,
        dto as UpdateFinancialReportDocumentRequestDTO
      );
    } else {
      // Crear
      await this.repository.crear(
        societyId,
        flowId,
        dto as CreateFinancialReportDocumentRequestDTO
      );
    }
  }
}


