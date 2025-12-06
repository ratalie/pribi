import type { Role } from './role.entity';
import type { Study } from './study.entity';
import type { RoutePermission } from './route-permission.entity';

/**
 * Tipo de rol simplificado según especificación
 * Según ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md:
 * - lector: Solo lectura
 * - editor: Puede editar
 * - admin: Administrador completo
 * - user: Usuario normal
 */
export type UserRole = 'lector' | 'editor' | 'admin' | 'user';

/**
 * Entidad User - Representa un usuario del sistema
 * 
 * Expandida según ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md:
 * - Agregado campo `name` para nombre del usuario
 * - Agregado `routePermissions` para permisos por ruta
 * - Agregado `assignedSocieties` para sociedades asignadas
 */
export interface User {
  id: string;
  email: string;
  name: string; // Nombre del usuario
  roleId: string;
  studyId: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  role: Role;
  study: Study;
  
  // Permisos por ruta (globales, no por sociedad)
  routePermissions: string[]; // Lista de rutas permitidas
  
  // Sociedades asignadas
  assignedSocieties: string[]; // IDs de sociedades asignadas
}

