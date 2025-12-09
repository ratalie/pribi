import type { RepositorioNode } from "../../domain/entities/repositorio-node.entity";
import type { RepositorioNodeDTO } from "../../application/dtos/repositorio-node.dto";

/**
 * Mapper para convertir DTOs del backend a entidades del dominio
 * 
 * Responsabilidad: Transformar datos del backend (DTO) a entidades de dominio
 * Ubicación: Infrastructure (según arquitectura hexagonal)
 */
export class RepositorioNodeMapper {
  /**
   * Convierte un DTO a una entidad del dominio
   */
  static toEntity(dto: RepositorioNodeDTO): RepositorioNode {
    return {
      id: String(dto.id),
      code: dto.code,
      societyId: String(dto.societyId),
      parentId: dto.parentId ? String(dto.parentId) : null,
      name: dto.name,
      type: dto.type === 1 ? "folder" : "document",
      path: dto.path,
      description: dto.description,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      isCore: dto.isCore,
      children: dto.children?.map(RepositorioNodeMapper.toEntity),
      mimeType: dto.mimeType,
      sizeInBytes: dto.sizeInBytes,
      versions: dto.versions,
    };
  }

  /**
   * Alias para toEntity (compatibilidad)
   */
  static fromDto(dto: RepositorioNodeDTO): RepositorioNode {
    return RepositorioNodeMapper.toEntity(dto);
  }

  /**
   * Convierte un array de DTOs a entidades del dominio
   */
  static toEntities(dtos: RepositorioNodeDTO[]): RepositorioNode[] {
    return dtos.map(RepositorioNodeMapper.toEntity);
  }
}

