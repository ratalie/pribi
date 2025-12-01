import type { User } from '../../domain/entities/user.entity';
import type { UserFlowAccess } from '../../domain/entities/permission.entity';

/**
 * DTO para respuesta de usuarios
 */
export interface UserResponseDto {
  users: User[];
}

/**
 * DTO para respuesta de permisos
 */
export interface PermissionsResponseDto {
  permissions: UserFlowAccess[];
}

/**
 * DTO para actualizar permisos
 */
export interface UpdatePermissionsRequestDto {
  permissions: UserFlowAccess[];
}

