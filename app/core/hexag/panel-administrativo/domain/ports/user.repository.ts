import type { User } from '../entities/user.entity';
import type { RoleName } from '../entities/role.entity';
import type { UserFlowAccess } from '../entities/permission.entity';
import type { SocietyInfo } from '../entities/society-assignment.entity';

/**
 * Puerto (contrato) para el repositorio de usuarios
 */
export interface UserRepository {
  /**
   * Obtiene todos los usuarios del sistema
   */
  findAll(): Promise<User[]>;

  /**
   * Obtiene un usuario por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Obtiene usuarios por rol
   */
  findByRole(roleName: RoleName): Promise<User[]>;

  /**
   * Obtiene permisos de un usuario
   */
  getUserPermissions(userId: string): Promise<UserFlowAccess[]>;

  /**
   * Actualiza permisos de un usuario
   */
  updateUserPermissions(
    userId: string,
    permissions: UserFlowAccess[]
  ): Promise<UserFlowAccess[]>;

  /**
   * Obtiene permisos de rutas de un usuario
   */
  getUserRoutePermissions(userId: string): Promise<string[]>;

  /**
   * Actualiza permisos de rutas de un usuario
   */
  updateUserRoutePermissions(
    userId: string,
    routePermissions: string[]
  ): Promise<string[]>;

  /**
   * Obtiene sociedades asignadas a un usuario
   */
  getUserAssignedSocieties(userId: string): Promise<string[]>;

  /**
   * Asigna usuario a sociedades
   */
  assignUserToSocieties(
    userId: string,
    societyIds: string[]
  ): Promise<string[]>;

  /**
   * Obtiene información de todas las sociedades disponibles
   */
  getAllSocieties(): Promise<SocietyInfo[]>;

  /**
   * Actualiza el rol de un usuario
   */
  updateUserRole(
    userId: string,
    role: 'lector' | 'editor' | 'admin' | 'user' | 'externo'
  ): Promise<User>;

  /**
   * Crea un nuevo usuario
   */
  createUser(
    email: string,
    password: string,
    roleId: string
  ): Promise<User>;

  /**
   * Elimina (desactiva) un usuario
   */
  deleteUser(userId: string): Promise<void>;

  /**
   * Actualiza el estado (activo/inactivo) de un usuario
   */
  updateUserStatus(
    userId: string,
    status: boolean
  ): Promise<User>;
}

