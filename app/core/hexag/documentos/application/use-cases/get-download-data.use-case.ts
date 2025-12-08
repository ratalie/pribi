import type { DownloadDataRepository } from "../../domain/ports/download-data.repository";
import type { DownloadDataDTO } from "../dtos/download-data.dto";

/**
 * Use Case: Obtener Download Data
 * 
 * Obtiene TODOS los datos de la junta para la vista de descargas.
 * Este endpoint agrega todos los GETs de los pasos anteriores en una sola llamada.
 */
export class GetDownloadDataUseCase {
  constructor(private readonly repository: DownloadDataRepository) {}

  async execute(societyId: number, flowId: number): Promise<DownloadDataDTO> {
    return this.repository.get(societyId, flowId);
  }
}

