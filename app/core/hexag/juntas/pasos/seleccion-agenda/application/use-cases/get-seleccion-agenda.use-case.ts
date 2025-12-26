/**
 * Use Case: Obtener Selección de Agenda
 * 
 * Obtiene la selección de agenda de una junta.
 */

import type { SeleccionAgendaRepositoryPort } from "../../domain/ports/seleccion-agenda.repository.port";
import type { SeleccionAgendaEntity } from "../../domain/entities/seleccion-agenda.entity";

export class GetSeleccionAgendaUseCase {
  constructor(private repository: SeleccionAgendaRepositoryPort) {}

  async execute(juntaId: string): Promise<SeleccionAgendaEntity | null> {
    if (!juntaId || juntaId.trim() === "") {
      throw new Error("El ID de junta es requerido");
    }

    return await this.repository.getByJuntaId(juntaId);
  }
}


