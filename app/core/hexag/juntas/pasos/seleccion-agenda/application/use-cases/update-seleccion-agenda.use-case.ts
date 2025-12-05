/**
 * Use Case: Actualizar Selección de Agenda
 * 
 * Actualiza la selección de agenda de una junta.
 */

import type { SeleccionAgendaRepositoryPort } from "../../domain/ports/seleccion-agenda.repository.port";
import type { SeleccionAgendaEntity } from "../../domain/entities/seleccion-agenda.entity";
import type { CreateSeleccionAgendaDTO } from "../dtos/create-seleccion-agenda.dto";

export class UpdateSeleccionAgendaUseCase {
  constructor(private repository: SeleccionAgendaRepositoryPort) {}

  async execute(id: string, data: Partial<CreateSeleccionAgendaDTO>): Promise<SeleccionAgendaEntity> {
    // Validaciones
    if (!id || id.trim() === "") {
      throw new Error("El ID es requerido");
    }

    if (data.puntosSeleccionados && data.puntosSeleccionados.length === 0) {
      throw new Error("Debe seleccionar al menos un punto de agenda");
    }

    return await this.repository.update(id, data);
  }
}


