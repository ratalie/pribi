import type { UserRepository } from '../../domain/ports/user.repository';
import type { User } from '../../domain/entities/user.entity';
import type { RoleName } from '../../domain/entities/role.entity';
import type { UserFlowAccess } from '../../domain/entities/permission.entity';
import type { SocietyInfo } from '../../domain/entities/society-assignment.entity';
import { withAuthHeaders } from '~/core/shared/http/with-auth-headers';

/**
 * Respuesta estándar de la API
 */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  code?: number;
}

/**
 * DTO de usuario desde el backend
 */
interface UserDto {
  id: string;
  email: string;
  roleId: string;
  studyId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: string;
    name: string;
  };
  study?: {
    id: string;
    name: string;
  };
}

/**
 * DTO para crear usuario
 */
interface CreateUserDto {
  email: string;
  password: string;
  roleId: string;
}

/**
 * DTO para actualizar rol
 */
interface UpdateUserRoleDto {
  roleId: string;
}

/**
 * DTO para actualizar estado
 */
interface UpdateUserStatusDto {
  status: boolean;
}

/**
 * DTO para asignar sociedades
 */
interface AssignUserSocietiesDto {
  societyIds: string[];
}

/**
 * DTO de sociedad asignada desde el backend
 */
interface UserSocietyDto {
  id: string;
  userId: string;
  societyId: string;
  society?: {
    id: string;
    name: string;
    ruc?: string;
  };
}

/**
 * Implementación HTTP del repositorio de usuarios
 */
export class UserHttpRepository implements UserRepository {
  private readonly basePath = '/api/v1/access-management';

  /**
   * Resuelve la URL base para las peticiones
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const candidates = [apiBase, origin, 'http://localhost:3000'];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || 'http://localhost:3000');
        return baseUrl.origin;
      } catch {
        continue;
      }
    }

    return origin || 'http://localhost:3000';
  }

  /**
   * Construye la URL completa para un endpoint
   */
  private getUrl(path: string): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith('/') ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
    return new URL(fullPath, baseUrl.origin).toString();
  }

  /**
   * Mapea DTO de usuario a entidad del dominio
   */
  private mapUserDtoToEntity(dto: UserDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.email.split('@')[0] || 'Usuario', // Generar nombre del email
      roleId: dto.roleId,
      studyId: dto.studyId,
      status: dto.status,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      role: dto.role
        ? {
            id: dto.role.id,
            name: dto.role.name as RoleName,
            status: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        : {
            id: '',
            name: 'Usuario' as RoleName,
            status: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
      study: dto.study
        ? {
            id: dto.study.id,
            name: dto.study.name,
            limit: 0,
            status: true,
          }
        : {
            id: dto.studyId,
            name: 'Estudio',
            limit: 0,
            status: true,
          },
      routePermissions: [], // Se carga por separado si es necesario
      assignedSocieties: [], // Se carga por separado si es necesario
    };
  }

  /**
   * Obtiene todos los usuarios del sistema
   */
  async findAll(): Promise<User[]> {
    const url = this.getUrl('/users');

    try {
      const response = await $fetch<ApiResponse<UserDto[]>>(
        url,
        withAuthHeaders({
          method: 'GET',
        }),
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al obtener usuarios');
      }

      // Mapear DTOs a entidades
      const users = response.data.map((dto) => this.mapUserDtoToEntity(dto));

      // Cargar sociedades asignadas para cada usuario
      const usersWithSocieties = await Promise.all(
        users.map(async (user) => {
          try {
            const societies = await this.getUserAssignedSocieties(user.id);
            return {
              ...user,
              assignedSocieties: societies,
            };
          } catch {
            return user;
          }
        }),
      );

      return usersWithSocieties;
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? 'Error al obtener usuarios';
      throw new Error(message);
    }
  }

  /**
   * Obtiene un usuario por ID
   */
  async findById(id: string): Promise<User | null> {
    const url = this.getUrl(`/users/${id}`);

    try {
      const response = await $fetch<ApiResponse<UserDto>>(
        url,
        withAuthHeaders({
          method: 'GET',
        }),
      );

      if (!response.success || !response.data) {
        return null;
      }

      const user = this.mapUserDtoToEntity(response.data);

      // Cargar sociedades asignadas
      try {
        const societies = await this.getUserAssignedSocieties(user.id);
        user.assignedSocieties = societies;
      } catch {
        // Ignorar error si no se pueden cargar sociedades
      }

      return user;
    } catch (error: any) {
      if (error?.statusCode === 404) {
        return null;
      }
      const message =
        error?.data?.message ?? error?.message ?? 'Error al obtener usuario';
      throw new Error(message);
    }
  }

  /**
   * Obtiene usuarios por rol
   */
  async findByRole(roleName: RoleName): Promise<User[]> {
    const allUsers = await this.findAll();
    return allUsers.filter((user) => user.role.name === roleName && user.status);
  }

  /**
   * Obtiene permisos de un usuario
   * NOTA: Este método usa el endpoint de permisos, no el de usuarios
   */
  async getUserPermissions(userId: string): Promise<UserFlowAccess[]> {
    // Este método debería usar el repositorio de permisos
    // Por ahora, retornamos un array vacío
    // TODO: Integrar con PermissionsRepository
    return [];
  }

  /**
   * Actualiza permisos de un usuario
   * NOTA: Este método usa el endpoint de permisos, no el de usuarios
   */
  async updateUserPermissions(
    userId: string,
    permissions: UserFlowAccess[],
  ): Promise<UserFlowAccess[]> {
    // Este método debería usar el repositorio de permisos
    // Por ahora, retornamos los permisos recibidos
    // TODO: Integrar con PermissionsRepository
    return permissions;
  }

  /**
   * Obtiene permisos de rutas de un usuario
   */
  async getUserRoutePermissions(userId: string): Promise<string[]> {
    // Este método debería obtener las rutas desde el árbol de permisos
    // Por ahora, retornamos un array vacío
    // TODO: Integrar con PermissionsRepository para obtener rutas
    return [];
  }

  /**
   * Actualiza permisos de rutas de un usuario
   */
  async updateUserRoutePermissions(
    userId: string,
    routePermissions: string[],
  ): Promise<string[]> {
    // Este método debería usar el endpoint de permisos
    // Por ahora, retornamos las rutas recibidas
    // TODO: Integrar con PermissionsRepository
    return routePermissions;
  }

  /**
   * Obtiene sociedades asignadas a un usuario
   */
  async getUserAssignedSocieties(userId: string): Promise<string[]> {
    const url = this.getUrl(`/users/${userId}/societies`);

    try {
      const response = await $fetch<ApiResponse<UserSocietyDto[]>>(
        url,
        withAuthHeaders({
          method: 'GET',
        }),
      );

      if (!response.success || !response.data) {
        return [];
      }

      return response.data.map((item) => item.societyId);
    } catch (error: any) {
      // Si hay error, retornar array vacío
      console.warn('Error al obtener sociedades asignadas:', error);
      return [];
    }
  }

  /**
   * Asigna usuario a sociedades
   */
  async assignUserToSocieties(
    userId: string,
    societyIds: string[],
  ): Promise<string[]> {
    const url = this.getUrl(`/users/${userId}/societies`);

    try {
      const body: AssignUserSocietiesDto = {
        societyIds,
      };

      const response = await $fetch<ApiResponse<UserSocietyDto[]>>(
        url,
        withAuthHeaders({
          method: 'POST',
          body,
        }),
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al asignar sociedades');
      }

      return response.data.map((item) => item.societyId);
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.message ??
        'Error al asignar sociedades';
      throw new Error(message);
    }
  }

  /**
   * Obtiene información de todas las sociedades disponibles
   * NOTA: Este método debería usar SocietiesRepository
   */
  async getAllSocieties(): Promise<SocietyInfo[]> {
    // Este método debería usar SocietiesRepository
    // Por ahora, retornamos un array vacío
    // TODO: Implementar en SocietiesRepository
    return [];
  }

  /**
   * Actualiza el rol de un usuario
   */
  async updateUserRole(
    userId: string,
    role: 'lector' | 'editor' | 'admin' | 'user',
  ): Promise<User> {
    const url = this.getUrl(`/users/${userId}/role`);

    try {
      // Mapear rol simplificado a roleId
      // TODO: Obtener roleId desde el backend o desde un store de roles
      const roleNameMap: Record<
        'lector' | 'editor' | 'admin' | 'user',
        RoleName
      > = {
        lector: 'Lector',
        editor: 'Usuario',
        admin: 'Administrador',
        user: 'Usuario',
      };

      // Por ahora, necesitamos obtener el roleId desde el backend
      // Esto debería hacerse obteniendo la lista de roles primero
      // Por simplicidad, asumimos que el backend acepta el nombre del rol
      const body: UpdateUserRoleDto = {
        roleId: '', // TODO: Obtener roleId real
      };

      const response = await $fetch<ApiResponse<UserDto>>(
        url,
        withAuthHeaders({
          method: 'PATCH',
          body,
        }),
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al actualizar rol');
      }

      const user = this.mapUserDtoToEntity(response.data);

      // Cargar sociedades asignadas
      try {
        const societies = await this.getUserAssignedSocieties(user.id);
        user.assignedSocieties = societies;
      } catch {
        // Ignorar error
      }

      return user;
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? 'Error al actualizar rol';
      throw new Error(message);
    }
  }
}
