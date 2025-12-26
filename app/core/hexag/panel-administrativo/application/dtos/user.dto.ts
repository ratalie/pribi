import type { User } from '../../domain/entities/user.entity';
import type { UserFlowAccess } from '../../domain/entities/permission.entity';
import type { UserMeResponseDto } from './society-assignment.dto';

/**
 * DTO para respuesta de usuarios
 */
export interface UserResponseDto {
  users: User[];
}

/**
 * DTO para respuesta de un usuario individual
 */
export interface SingleUserResponseDto {
  user: User;
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

/**
 * DTO para actualizar rol de usuario
 */
export interface UpdateUserRoleRequestDto {
  role: 'lector' | 'editor' | 'admin' | 'user';
}

/**
 * Re-exportar UserMeResponseDto para facilitar imports
 */
export type { UserMeResponseDto } from './society-assignment.dto';

