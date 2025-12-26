import type { UserOverride } from '../../domain/entities/user-override.entity';
import type { UserOverrideDto } from '../../application/dtos/user-override.dto';
import { FrontendToBackendActionMap } from '../../domain/enums/permission-action.enum';

/**
 * Mapper para transformar UserOverride entre Entity y DTO
 */
export class UserOverrideMapper {
  /**
   * Transforma array de entidades a DTO
   * 
   * El backend espera un formato específico con overrides agrupados por flowCode y module
   */
  static toDto(overrides: UserOverride[]): UserOverrideDto {
    // Agrupar overrides por flowCode y module
    const grouped = new Map<string, Map<string, UserOverride['actions']>>();

    for (const override of overrides) {
      const key = `${override.flowCode}:${override.module}`;
      
      if (!grouped.has(override.flowCode)) {
        grouped.set(override.flowCode, new Map());
      }
      
      const moduleMap = grouped.get(override.flowCode)!;
      
      if (!moduleMap.has(override.module)) {
        moduleMap.set(override.module, []);
      }
      
      moduleMap.get(override.module)!.push(...override.actions);
    }

    // Convertir a formato del DTO
    const dtoOverrides: UserOverrideDto['overrides'] = [];

    for (const [flowCode, moduleMap] of grouped.entries()) {
      for (const [module, actions] of moduleMap.entries()) {
        dtoOverrides.push({
          flowCode,
          module,
          actions: actions.map((action) => ({
            // Convertir acción del frontend al backend
            action: FrontendToBackendActionMap[action.action] || action.action,
            isOverride: action.isOverride,
          })),
        });
      }
    }

    return {
      overrides: dtoOverrides,
    };
  }

  /**
   * Transforma DTO a array de entidades
   * 
   * Nota: El DTO viene del backend agrupado, pero necesitamos separarlo por userId
   */
  static toDomain(dto: UserOverrideDto, userId: string): UserOverride[] {
    const entities: UserOverride[] = [];

    for (const override of dto.overrides) {
      entities.push({
        userId,
        flowCode: override.flowCode,
        module: override.module,
        actions: override.actions.map((action) => ({
          // Convertir acción del backend al frontend si es necesario
          action: action.action as any, // El mapper de PermissionAction se encargará
          isOverride: action.isOverride,
        })),
      });
    }

    return entities;
  }
}








