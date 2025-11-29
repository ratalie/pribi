import type { AgendaItemsDTO } from "../../application/dtos/agenda-item.dto";

/**
 * Port (contrato) para el repositorio de Agenda Items
 * 
 * Define las operaciones para obtener y actualizar los puntos de agenda
 * seleccionados en una junta de accionistas.
 */
export interface AgendaItemsRepository {
  /**
   * Obtiene los puntos de agenda guardados para una junta
   * @param societyId ID de la sociedad
   * @param flowId ID del flujo de junta
   * @returns DTO con los puntos de agenda (todos los campos con false si no hay datos)
   */
  get(societyId: number, flowId: number): Promise<AgendaItemsDTO | null>;

  /**
   * Actualiza los puntos de agenda para una junta
   * @param societyId ID de la sociedad
   * @param flowId ID del flujo de junta
   * @param payload DTO con los puntos de agenda a guardar
   */
  update(societyId: number, flowId: number, payload: AgendaItemsDTO): Promise<void>;
}

