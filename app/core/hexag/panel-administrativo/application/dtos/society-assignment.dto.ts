import type { SocietyInfo } from '../../domain/entities/society-assignment.entity';

/**
 * DTO para respuesta de sociedades asignadas
 * GET /api/v2/users/:userId/societies
 */
export interface UserSocietiesResponseDto {
  assignedSocieties: string[]; // IDs de sociedades asignadas
  societies: SocietyInfo[]; // Información completa de las sociedades
}

/**
 * DTO para asignar usuario a sociedades
 * POST /api/v2/users/:userId/societies
 * PUT /api/v2/users/:userId/societies
 */
export interface AssignUserToSocietiesRequestDto {
  societyIds: string[]; // IDs de sociedades a asignar
}

/**
 * DTO para respuesta de usuario completo después del login
 * GET /api/v2/users/me
 */
export interface UserMeResponseDto {
  id: string;
  email: string;
  name: string;
  role: 'lector' | 'editor' | 'admin' | 'user';
  routePermissions: string[]; // Lista de rutas permitidas
  assignedSocieties: string[]; // IDs de sociedades asignadas
}

