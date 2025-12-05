/**
 * Mapper: Detalles de Junta
 * 
 * Convierte entre DTO (backend) y Entity (dominio).
 */

import type { DetallesJuntaResponseDTO } from "../../application/dtos/detalles-junta-response.dto";
import type { DetallesJuntaEntity } from "../../domain/entities/detalles-junta.entity";

export class DetallesJuntaMapper {
  /**
   * DTO (backend) → Entity (dominio)
   */
  static toDomain(dto: DetallesJuntaResponseDTO): DetallesJuntaEntity {
    return {
      id: dto.id,
      juntaId: dto.junta_id,
      tipoJunta: dto.tipo_junta as "GENERAL" | "ESPECIAL" | "UNIVERSAL",
      modoRealizacion: dto.modo_realizacion as "PRESENCIAL" | "VIRTUAL" | "MIXTA",
      fechaJunta: new Date(dto.fecha_junta),
      horaJunta: dto.hora_junta,
      lugarJunta: dto.lugar_junta,
      enlaceVirtual: dto.enlace_virtual,
      observaciones: dto.observaciones,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  /**
   * Entity (dominio) → DTO (backend)
   */
  static toDTO(entity: DetallesJuntaEntity): DetallesJuntaResponseDTO {
    return {
      id: entity.id,
      junta_id: entity.juntaId,
      tipo_junta: entity.tipoJunta,
      modo_realizacion: entity.modoRealizacion,
      fecha_junta: entity.fechaJunta.toISOString().split('T')[0] || "", // Solo fecha (YYYY-MM-DD)
      hora_junta: entity.horaJunta,
      lugar_junta: entity.lugarJunta,
      enlace_virtual: entity.enlaceVirtual,
      observaciones: entity.observaciones,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}

