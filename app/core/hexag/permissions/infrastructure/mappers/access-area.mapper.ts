import type { AccessArea } from '../../domain/entities/access-area.entity';
import type { AccessAreaDto } from '../../application/dtos/access-area.dto';
import { AccessAreaEnum } from '../../domain/enums/access-area.enum';
import { AccessRouteMapper } from './access-route.mapper';

/**
 * Mapper para transformar AccessArea entre DTO y Entity
 */
export class AccessAreaMapper {
  /**
   * Transforma DTO a Entity
   */
  static toDomain(dto: AccessAreaDto): AccessArea {
    return {
      area: dto.area as AccessAreaEnum,
      displayName: dto.displayName,
      description: dto.description,
      routes: dto.routes.map(AccessRouteMapper.toDomain),
      status: (dto as any).status, // El backend puede incluir status en /access/full
    };
  }

  /**
   * Transforma Entity a DTO
   */
  static toDto(entity: AccessArea): AccessAreaDto {
    return {
      area: entity.area,
      displayName: entity.displayName,
      description: entity.description,
      routes: entity.routes.map(AccessRouteMapper.toDto),
    };
  }

  /**
   * Transforma array de DTOs a entidades
   */
  static toDomainArray(dtos: AccessAreaDto[]): AccessArea[] {
    return dtos.map((dto) => this.toDomain(dto));
  }

  /**
   * Transforma array de entidades a DTOs
   */
  static toDtoArray(entities: AccessArea[]): AccessAreaDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}






