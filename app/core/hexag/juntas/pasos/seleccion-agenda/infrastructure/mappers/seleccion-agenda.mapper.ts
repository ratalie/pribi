/**
 * Mapper: Selección de Agenda
 * 
 * Convierte entre DTO (backend) y Entity (dominio).
 */

import type { SeleccionAgendaResponseDTO } from "../../application/dtos/seleccion-agenda-response.dto";
import type { SeleccionAgendaEntity } from "../../domain/entities/seleccion-agenda.entity";

export class SeleccionAgendaMapper {
  /**
   * DTO (backend) → Entity (dominio)
   */
  static toDomain(dto: SeleccionAgendaResponseDTO): SeleccionAgendaEntity {
    return {
      id: dto.id,
      juntaId: dto.junta_id, // Snake case → Camel case
      puntosSeleccionados: Array.isArray(dto.puntos_seleccionados) ? dto.puntos_seleccionados : [],
      createdAt: new Date(dto.created_at), // String → Date
      updatedAt: new Date(dto.updated_at),
    };
  }

  /**
   * Entity (dominio) → DTO (backend)
   */
  static toDTO(entity: SeleccionAgendaEntity): SeleccionAgendaResponseDTO {
    return {
      id: entity.id,
      junta_id: entity.juntaId, // Camel case → Snake case
      puntos_seleccionados: entity.puntosSeleccionados,
      created_at: entity.createdAt.toISOString(), // Date → String
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}

