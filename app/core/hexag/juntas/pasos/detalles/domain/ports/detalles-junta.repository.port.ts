/**
 * Port (Contrato): Repositorio de Detalles de Junta
 * 
 * Define las operaciones que debe implementar Infrastructure.
 */

import type { DetallesJuntaEntity } from "../entities/detalles-junta.entity";
import type { CreateDetallesJuntaDTO } from "../../application/dtos/create-detalles-junta.dto";

export interface DetallesJuntaRepositoryPort {
  /**
   * Crear o actualizar los detalles de una junta
   */
  create(juntaId: string, data: CreateDetallesJuntaDTO): Promise<DetallesJuntaEntity>;

  /**
   * Obtener los detalles de una junta
   */
  getByJuntaId(juntaId: string): Promise<DetallesJuntaEntity | null>;

  /**
   * Actualizar los detalles de una junta
   */
  update(id: string, data: Partial<CreateDetallesJuntaDTO>): Promise<DetallesJuntaEntity>;
}


