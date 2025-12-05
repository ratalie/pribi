/**
 * Use Case: Crear Selección de Agenda
 * 
 * Orquesta la lógica de creación de selección de agenda.
 */

import type { SeleccionAgendaRepositoryPort } from "../../domain/ports/seleccion-agenda.repository.port";
import type { SeleccionAgendaEntity } from "../../domain/entities/seleccion-agenda.entity";
import type { CreateSeleccionAgendaDTO } from "../dtos/create-seleccion-agenda.dto";

export class CreateSeleccionAgendaUseCase {
  constructor(private repository: SeleccionAgendaRepositoryPort) {}

  async execute(juntaId: string, data: CreateSeleccionAgendaDTO): Promise<SeleccionAgendaEntity> {
    // Validaciones de negocio
    this.validate(data);

    // Delegar a infraestructura
    return await this.repository.create(juntaId, data);
  }

  private validate(data: CreateSeleccionAgendaDTO): void {
    if (!data.puntosSeleccionados || data.puntosSeleccionados.length === 0) {
      throw new Error("Debe seleccionar al menos un punto de agenda");
    }

    // Validar que no haya duplicados
    const uniquePuntos = new Set(data.puntosSeleccionados);
    if (uniquePuntos.size !== data.puntosSeleccionados.length) {
      throw new Error("No puede seleccionar puntos duplicados");
    }
  }
}


