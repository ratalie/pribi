/**
 * Mapper: Instalación de Junta (DTO ↔ Entity)
 */

import type { InstalacionJuntaEntity } from "../../domain/entities/instalacion-junta.entity";

export interface InstalacionJuntaResponseDTO {
  id: string;
  junta_id: string;
  fecha_instalacion: string;
  tipo_convocatoria: string;
  quorum_presente: number;
  instalada: boolean;
  created_at: string;
  updated_at: string;
}

export class InstalacionJuntaMapper {
  static toDomain(dto: InstalacionJuntaResponseDTO): InstalacionJuntaEntity {
    return {
      id: dto.id,
      juntaId: dto.junta_id,
      fechaInstalacion: new Date(dto.fecha_instalacion),
      tipoConvocatoria: dto.tipo_convocatoria as "PRIMERA" | "SEGUNDA",
      quorumPresente: dto.quorum_presente,
      instalada: dto.instalada,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDTO(entity: InstalacionJuntaEntity): InstalacionJuntaResponseDTO {
    return {
      id: entity.id,
      junta_id: entity.juntaId,
      fecha_instalacion: entity.fechaInstalacion.toISOString(),
      tipo_convocatoria: entity.tipoConvocatoria,
      quorum_presente: entity.quorumPresente,
      instalada: entity.instalada,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}


