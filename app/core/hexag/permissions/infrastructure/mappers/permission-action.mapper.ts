import type { PermissionAction } from '../../domain/entities/permission-action.entity';
import type { PermissionActionDto } from '../../application/dtos/permission-action.dto';
import { PermissionActionEnum, BackendToFrontendActionMap, FrontendToBackendActionMap } from '../../domain/enums/permission-action.enum';

/**
 * Mapper para transformar PermissionAction entre DTO y Entity
 */
export class PermissionActionMapper {
  /**
   * Transforma DTO a Entity
   * 
   * Convierte acciones del backend (read, write, etc.) al formato del frontend (view, create, etc.)
   */
  static toDomain(dto: PermissionActionDto): PermissionAction {
    // Si viene del backend como string (read, write, etc.), convertir a enum del frontend
    let action: PermissionActionEnum;
    
    if (typeof dto.action === 'string') {
      // Intentar mapear desde backend
      const mapped = BackendToFrontendActionMap[dto.action.toLowerCase()];
      if (mapped) {
        action = mapped;
      } else {
        // Si no está en el mapa, intentar usar directamente como enum del frontend
        action = dto.action as PermissionActionEnum;
      }
    } else {
      action = dto.action;
    }

    // El backend puede usar 'status' (true/false) o 'enabled' (boolean)
    // Convertir 'status' a 'enabled' si está presente
    const enabled = dto.status !== undefined ? dto.status : (dto.enabled ?? true);
    const disabled = dto.status !== undefined ? !dto.status : (dto.disabled ?? false);

    return {
      action,
      enabled,
      disabled: !enabled,
    };
  }

  /**
   * Transforma Entity a DTO
   * 
   * Convierte acciones del frontend (view, create, etc.) al formato del backend (read, write, etc.)
   */
  static toDto(entity: PermissionAction): PermissionActionDto {
    // Convertir a formato del backend si es necesario
    const backendAction = FrontendToBackendActionMap[entity.action] || entity.action;

    return {
      action: backendAction,
      enabled: entity.enabled,
      disabled: entity.disabled,
    };
  }
}






