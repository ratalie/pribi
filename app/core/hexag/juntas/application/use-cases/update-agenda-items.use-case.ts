import type { AgendaItemsRepository } from "../../domain/ports/agenda-items.repository";
import type { AgendaItemsDTO } from "../dtos/agenda-item.dto";

/**
 * Use Case: Actualizar Puntos de Agenda
 * 
 * Guarda los puntos de agenda seleccionados para una junta.
 */
export class UpdateAgendaItemsUseCase {
  constructor(private readonly repository: AgendaItemsRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    payload: AgendaItemsDTO
  ): Promise<void> {
    await this.repository.update(societyId, flowId, payload);
  }
}

