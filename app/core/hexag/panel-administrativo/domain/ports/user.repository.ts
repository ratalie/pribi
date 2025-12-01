import type { User } from '../entities/user.entity';
import type { RoleName } from '../entities/role.entity';
import type { UserFlowAccess } from '../entities/permission.entity';

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
}

