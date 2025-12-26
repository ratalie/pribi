import type { AccessRoute } from '../../domain/entities/access-route.entity';
import type { AccessRouteDto } from '../../application/dtos/access-route.dto';
import { PermissionActionMapper } from './permission-action.mapper';

/**
 * Mapper para transformar AccessRoute entre DTO y Entity
 */
export class AccessRouteMapper {
  /**
   * Transforma DTO a Entity
   */
  static toDomain(dto: AccessRouteDto): AccessRoute {
    return {
      key: dto.key,
      path: dto.path,
      displayName: dto.displayName,
      description: dto.description,
      actions: dto.actions.map(PermissionActionMapper.toDomain),
      modules: dto.modules?.map((module) => ({
        module: module.module,
        displayName: module.displayName,
        actions: module.actions.map(PermissionActionMapper.toDomain),
      })),
      status: dto.status,
    };
  }

  /**
   * Transforma Entity a DTO
   */
  static toDto(entity: AccessRoute): AccessRouteDto {
    return {
      key: entity.key,
      path: entity.path,
      displayName: entity.displayName,
      description: entity.description,
      actions: entity.actions.map(PermissionActionMapper.toDto),
      modules: entity.modules?.map((module) => ({
        module: module.module,
        displayName: module.displayName,
        actions: module.actions.map(PermissionActionMapper.toDto),
      })),
      status: entity.status,
    };
  }
}








