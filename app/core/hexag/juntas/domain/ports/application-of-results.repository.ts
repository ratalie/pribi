import type { ApplicationOfResultsDTO } from "../../application/dtos/application-of-results.dto";

/**
 * Repository port para Application of Results
 * 
 * Define el contrato para guardar, obtener y actualizar
 * la aplicación de resultados económicos
 */
export interface ApplicationOfResultsRepository {
  /**
   * Crear aplicación de resultados
   */
  crear(
    societyId: number,
    flowId: number,
    dto: ApplicationOfResultsDTO
  ): Promise<void>;

  /**
   * Obtener aplicación de resultados
   */
  obtener(
    societyId: number,
    flowId: number
  ): Promise<ApplicationOfResultsDTO | null>;

  /**
   * Actualizar aplicación de resultados
   */
  actualizar(
    societyId: number,
    flowId: number,
    dto: ApplicationOfResultsDTO
  ): Promise<void>;
}



