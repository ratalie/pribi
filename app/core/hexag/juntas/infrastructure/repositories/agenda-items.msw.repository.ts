/**
 * Repositorio MSW para Agenda Items
 *
 * Implementa AgendaItemsRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 *
 * @pattern Repository Pattern - MSW Implementation
 */
import type { AgendaItemsRepository } from "../../domain/ports/agenda-items.repository";
import type { AgendaItemsDTO } from "../../application/dtos/agenda-item.dto";
import {
  getAgendaItemsMock,
  updateAgendaItemsMock,
} from "../mocks/data/agenda-items.state";

export class AgendaItemsMswRepository implements AgendaItemsRepository {
  async get(societyId: number, flowId: number): Promise<AgendaItemsDTO | null> {
    return await getAgendaItemsMock(societyId, flowId);
  }

  async update(societyId: number, flowId: number, payload: AgendaItemsDTO): Promise<void> {
    await updateAgendaItemsMock(societyId, flowId, payload);
  }
}

