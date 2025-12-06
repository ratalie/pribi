import type { RoutePermission } from '../../domain/entities/route-permission.entity';

/**
 * DTO para respuesta de permisos de rutas
 * GET /api/v2/users/:userId/route-permissions
 */
export interface RoutePermissionsResponseDto {
  routePermissions: string[]; // Lista de rutas permitidas
}

/**
 * DTO para actualizar permisos de rutas
 * PUT /api/v2/users/:userId/route-permissions
 */
export interface UpdateRoutePermissionsRequestDto {
  routePermissions: string[]; // Lista de rutas permitidas
}

/**
 * DTO para verificar acceso a una ruta
 * GET /api/v2/users/:userId/can-access?route=...
 */
export interface CanAccessRouteResponseDto {
  allowed: boolean;
  route: string;
}

