/**
 * Port (Contrato): Repositorio de Selección de Agenda
 * 
 * Define las operaciones que debe implementar Infrastructure.
 */

import type { SeleccionAgendaEntity } from "../entities/seleccion-agenda.entity";
import type { CreateSeleccionAgendaDTO } from "../../application/dtos/create-seleccion-agenda.dto";

export interface SeleccionAgendaRepositoryPort {
  /**
   * Crear o actualizar la selección de agenda de una junta
   */
  create(juntaId: string, data: CreateSeleccionAgendaDTO): Promise<SeleccionAgendaEntity>;

  /**
   * Obtener la selección de agenda de una junta
   */
  getByJuntaId(juntaId: string): Promise<SeleccionAgendaEntity | null>;

  /**
   * Actualizar la selección de agenda
   */
  update(id: string, data: Partial<CreateSeleccionAgendaDTO>): Promise<SeleccionAgendaEntity>;
}


