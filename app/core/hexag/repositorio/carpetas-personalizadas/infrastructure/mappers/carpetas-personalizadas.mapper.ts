import type { CarpetaPersonalizada } from '../../domain/entities/carpeta-personalizada.entity';
import type { EnlaceDocumento } from '../../domain/entities/enlace-documento.entity';
import type { CarpetaPersonalizadaDTO } from '../../application/dtos/carpeta-personalizada.dto';
import type { EnlaceDocumentoDTO } from '../../application/dtos/enlace-documento.dto';

/**
 * Mapper para convertir entre DTOs y Entidades de Carpetas Personalizadas
 */
export class CarpetasPersonalizadasMapper {
  /**
   * Convierte DTO a entidad CarpetaPersonalizada
   */
  static dtoToEntity(dto: CarpetaPersonalizadaDTO): CarpetaPersonalizada {
    return {
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      isChatIA: dto.isChatIA,
      fechaCreacion: new Date(dto.fechaCreacion),
      fechaModificacion: new Date(dto.fechaModificacion),
      creadorId: dto.creadorId,
      creadorNombre: dto.creadorNombre,
      totalEnlaces: dto.totalEnlaces,
    };
  }

  /**
   * Convierte entidad a DTO CarpetaPersonalizada
   */
  static entityToDto(entity: CarpetaPersonalizada): CarpetaPersonalizadaDTO {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      isChatIA: entity.isChatIA,
      fechaCreacion: entity.fechaCreacion.toISOString(),
      fechaModificacion: entity.fechaModificacion.toISOString(),
      creadorId: entity.creadorId,
      creadorNombre: entity.creadorNombre,
      totalEnlaces: entity.totalEnlaces,
    };
  }

  /**
   * Convierte DTO a entidad EnlaceDocumento
   */
  static enlaceDtoToEntity(dto: EnlaceDocumentoDTO): EnlaceDocumento {
    return {
      id: dto.id,
      nombre: dto.nombre,
      tipo: dto.tipo,
      origen: dto.origen,
      fechaEnlace: new Date(dto.fechaEnlace),
      documentoId: dto.documentoId,
      carpetaId: dto.carpetaId,
    };
  }

  /**
   * Convierte entidad a DTO EnlaceDocumento
   */
  static enlaceEntityToDto(entity: EnlaceDocumento): EnlaceDocumentoDTO {
    return {
      id: entity.id,
      nombre: entity.nombre,
      tipo: entity.tipo,
      origen: entity.origen,
      fechaEnlace: entity.fechaEnlace.toISOString(),
      documentoId: entity.documentoId,
      carpetaId: entity.carpetaId,
    };
  }
}

