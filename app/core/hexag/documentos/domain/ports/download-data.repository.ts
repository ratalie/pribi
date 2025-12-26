import type { DownloadDataDTO } from "../../application/dtos/download-data.dto";

/**
 * Puerto (contrato) para el repositorio de Download Data
 */
export interface DownloadDataRepository {
  /**
   * Obtiene todos los datos de la junta para la vista de descargas
   * @param societyId ID de la sociedad
   * @param flowId ID del flujo de junta
   * @returns DTO con todos los datos de la junta
   */
  get(societyId: number, flowId: number): Promise<DownloadDataDTO>;
}

