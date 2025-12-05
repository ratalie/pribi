/**
 * Mapper: Asistencia (DTO ↔ Entity)
 */

import type { AsistenciaEntity } from "../../domain/entities/asistencia.entity";

export interface AsistenciaResponseDTO {
  id: string;
  junta_id: string;
  accionista_id: string;
  asistio: boolean;
  representado_por_id?: string;
  numero_acciones: number;
  porcentaje_participacion: number;
  created_at: string;
  updated_at: string;
}

export class AsistenciaMapper {
  static toDomain(dto: AsistenciaResponseDTO): AsistenciaEntity {
    return {
      id: dto.id,
      juntaId: dto.junta_id,
      accionistaId: dto.accionista_id,
      asistio: dto.asistio,
      representadoPorId: dto.representado_por_id,
      numeroAcciones: dto.numero_acciones,
      porcentajeParticipacion: dto.porcentaje_participacion,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDTO(entity: AsistenciaEntity): AsistenciaResponseDTO {
    return {
      id: entity.id,
      junta_id: entity.juntaId,
      accionista_id: entity.accionistaId,
      asistio: entity.asistio,
      representado_por_id: entity.representadoPorId,
      numero_acciones: entity.numeroAcciones,
      porcentaje_participacion: entity.porcentajeParticipacion,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}


