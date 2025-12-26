import type { AgendaItemsRepository } from "../../domain/ports/agenda-items.repository";
import type { AgendaItemsDTO } from "../dtos/agenda-item.dto";
import { createDefaultAgendaItemsDTO } from "../dtos/agenda-item.dto";

/**
 * Use Case: Obtener Puntos de Agenda
 * 
 * Obtiene los puntos de agenda guardados para una junta.
 * Si no hay datos guardados, devuelve un DTO con todos los campos en false.
 */
export class GetAgendaItemsUseCase {
  constructor(private readonly repository: AgendaItemsRepository) {}

  async execute(societyId: number, flowId: number): Promise<AgendaItemsDTO> {
    const result = await this.repository.get(societyId, flowId);
    
    // Si no hay datos guardados, devolver valores por defecto (todos false)
    if (!result) {
      return createDefaultAgendaItemsDTO();
    }
    
    return result;
  }
}

