import type { UserRepository } from "../../domain/ports/user.repository";
import type { User } from "../../domain/entities/user.entity";
import type { RoleName } from "../../domain/entities/role.entity";
import type { UserFlowAccess } from "../../domain/entities/permission.entity";
import type { SocietyInfo } from "../../domain/entities/society-assignment.entity";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { PermissionsHttpRepository } from "~/core/hexag/permissions/infrastructure/repositories/permissions.http.repository";
import { SocietiesHttpRepository } from "./societies-http.repository";

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
  private readonly basePath = "/api/v2/access-management";

  /**
   * Resuelve la URL base para las peticiones
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base || base.trim() === "") continue;
      try {
        // Si base ya es una URL completa, usarla directamente
        if (base.startsWith("http://") || base.startsWith("https://")) {
          const url = new URL(base);
          return url.origin;
        }
        // Si no, construirla con el origin
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        return baseUrl.origin;
      } catch (error) {
        console.warn(`[UserHttpRepository] URL base inválida: ${base}`, error);
        continue;
      }
    }

    // Fallback seguro
    const fallback = origin || "http://localhost:3000";
    console.warn(`[UserHttpRepository] Usando URL fallback: ${fallback}`);
    return fallback;
  }

  /**
   * Construye la URL completa para un endpoint
   */
  private getUrl(path: string): string {
    try {
      const baseUrl = this.resolveBaseUrl();
      
      // Validar que baseUrl sea válida
      if (!baseUrl || baseUrl.trim() === "") {
        throw new Error("URL base inválida");
      }

      // Limpiar path (remover espacios, etc)
      const cleanPath = path.trim();
      const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
      const fullPath = `${basePath}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
      
      // Construir URL
      const url = new URL(fullPath, baseUrl);
      return url.toString();
    } catch (error) {
      console.error(`[UserHttpRepository] Error al construir URL para path: ${path}`, error);
      // Fallback seguro
      const fallback = `http://localhost:3000${this.basePath}${path.startsWith("/") ? path : `/${path}`}`;
      console.warn(`[UserHttpRepository] Usando URL fallback: ${fallback}`);
      return fallback;
    }
  }

  /**
   * Mapea DTO de usuario a entidad del dominio
   */
  private mapUserDtoToEntity(dto: UserDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.email.split("@")[0] || "Usuario", // Generar nombre del email
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
            id: "",
            name: "Usuario" as RoleName,
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
            name: "Estudio",
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
    const url = this.getUrl("/users");

    try {
      const response = await $fetch<ApiResponse<UserDto[]>>(
        url,
        withAuthHeaders({
          method: "GET" as const,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al obtener usuarios");
      }

      // Validar que data sea un array
      if (!Array.isArray(response.data)) {
        console.error(
          "[UserHttpRepository] findAll: respuesta no es un array:",
          response.data
        );
        throw new Error("Error: respuesta inválida del servidor (no es un array)");
      }

      // Mapear DTOs a entidades
      const users = response.data.map((dto) => this.mapUserDtoToEntity(dto));

      console.log(
        "[UserHttpRepository] findAll: usuarios recibidos del backend:",
        users.length
      );

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
        })
      );

      return usersWithSocieties;
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "Error al obtener usuarios";
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
          method: "GET" as const,
        })
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
      const message = error?.data?.message ?? error?.message ?? "Error al obtener usuario";
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
   *
   * NOTA: UserFlowAccess es un formato legacy. El sistema actual usa AccessArea[].
   * Este método se mantiene para compatibilidad pero retorna array vacío.
   * Para obtener permisos reales, usar PermissionsHttpRepository.getUserAccess()
   */
  async getUserPermissions(_userId: string): Promise<UserFlowAccess[]> {
    // UserFlowAccess es un formato legacy que no se usa en el nuevo sistema
    // El nuevo sistema usa AccessArea[] desde PermissionsHttpRepository
    // Retornamos array vacío para mantener compatibilidad con el port
    console.warn(
      "[UserHttpRepository] getUserPermissions() es legacy. Usar PermissionsHttpRepository.getUserAccess()"
    );
    return [];
  }

  /**
   * Actualiza permisos de un usuario
   * NOTA: Este método usa el endpoint de permisos, no el de usuarios
   *
   * NOTA: UserFlowAccess es un formato legacy. El sistema actual usa AccessArea[].
   * Este método se mantiene para compatibilidad pero no hace nada.
   * Para actualizar permisos, usar PermissionsHttpRepository.updateUserOverrides()
   */
  async updateUserPermissions(
    userId: string,
    permissions: UserFlowAccess[]
  ): Promise<UserFlowAccess[]> {
    // UserFlowAccess es un formato legacy que no se usa en el nuevo sistema
    // El nuevo sistema usa BackendOverride[] desde PermissionsHttpRepository
    // Retornamos input para mantener compatibilidad con el port
    console.warn(
      "[UserHttpRepository] updateUserPermissions() es legacy. Usar PermissionsHttpRepository.updateUserOverrides()"
    );
    return permissions;
  }

  /**
   * Obtiene permisos de rutas de un usuario
   * Extrae las rutas habilitadas del árbol de permisos
   */
  async getUserRoutePermissions(userId: string): Promise<string[]> {
    try {
      const permissionsRepo = new PermissionsHttpRepository();
      const accessAreas = await permissionsRepo.getUserAccess(userId);

      // Extraer todas las rutas habilitadas
      const routes: string[] = [];

      for (const area of accessAreas) {
        for (const route of area.routes) {
          // Solo incluir rutas que tengan al menos una acción habilitada
          const hasEnabledAction = route.actions.some((action) => action.enabled);
          if (hasEnabledAction) {
            routes.push(route.path);
          }
        }
      }

      return routes;
    } catch (error: any) {
      console.warn("[UserHttpRepository] Error al obtener rutas de permisos:", error);
      return [];
    }
  }

  /**
   * Actualiza permisos de rutas de un usuario
   *
   * NOTA: Este método es complejo de implementar porque requiere convertir
   * rutas a la estructura de overrides del backend. Por ahora retorna input.
   * Para actualizar permisos, usar PermissionsHttpRepository.updateUserOverrides()
   */
  async updateUserRoutePermissions(
    userId: string,
    routePermissions: string[]
  ): Promise<string[]> {
    // La conversión de rutas a overrides es compleja y requiere mapeo de áreas/rutas
    // Por ahora, retornamos input para mantener compatibilidad
    // Para actualizar permisos reales, usar PermissionsHttpRepository.updateUserOverrides()
    console.warn(
      "[UserHttpRepository] updateUserRoutePermissions() no implementado completamente. Usar PermissionsHttpRepository.updateUserOverrides()"
    );
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
          method: "GET" as const,
        })
      );

      if (!response.success || !response.data) {
        return [];
      }

      return response.data.map((item) => item.societyId);
    } catch (error: any) {
      // Si hay error, retornar array vacío
      console.warn("Error al obtener sociedades asignadas:", error);
      return [];
    }
  }

  /**
   * Asigna usuario a sociedades
   */
  async assignUserToSocieties(userId: string, societyIds: string[]): Promise<string[]> {
    const url = this.getUrl(`/users/${userId}/societies`);

    try {
      const body: AssignUserSocietiesDto = {
        societyIds,
      };

      const response = await $fetch<ApiResponse<UserSocietyDto[]>>(
        url,
        withAuthHeaders({
          method: "POST" as const,
          body,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al asignar sociedades");
      }

      return response.data.map((item) => item.societyId);
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "Error al asignar sociedades";
      throw new Error(message);
    }
  }

  /**
   * Obtiene información de todas las sociedades disponibles
   */
  async getAllSocieties(): Promise<SocietyInfo[]> {
    try {
      const societiesRepo = new SocietiesHttpRepository();
      return await societiesRepo.getAllSocieties();
    } catch (error: any) {
      console.warn("[UserHttpRepository] Error al obtener sociedades:", error);
      return [];
    }
  }

  /**
   * Actualiza el rol de un usuario
   */
  async updateUserRole(
    userId: string,
    role: "lector" | "editor" | "admin" | "user"
  ): Promise<User> {
    const url = this.getUrl(`/users/${userId}/role`);

    try {
      // Mapear rol simplificado a nombre de rol del backend
      const roleNameMap: Record<"lector" | "editor" | "admin" | "user", RoleName> = {
        lector: "Lector",
        editor: "Usuario",
        admin: "Administrador",
        user: "Usuario",
      };

      const roleName = roleNameMap[role];

      // Obtener lista de roles desde el backend para encontrar el roleId
      const rolesUrl = this.getUrl("/roles");
      const rolesResponse = await $fetch<ApiResponse<Array<{ id: string; name: string }>>>(
        rolesUrl,
        withAuthHeaders({
          method: "GET" as const,
        })
      );

      if (!rolesResponse.success || !rolesResponse.data) {
        throw new Error("No se pudieron obtener los roles disponibles");
      }

      // Buscar el roleId correspondiente al nombre del rol
      const roleData = rolesResponse.data.find((r) => r.name === roleName);
      if (!roleData) {
        throw new Error(`Rol '${roleName}' no encontrado en el sistema`);
      }

      const body: UpdateUserRoleDto = {
        roleId: roleData.id,
      };

      const response = await $fetch<ApiResponse<UserDto>>(
        url,
        withAuthHeaders({
          method: "PATCH" as const,
          body,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al actualizar rol");
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
      const message = error?.data?.message ?? error?.message ?? "Error al actualizar rol";
      throw new Error(message);
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(email: string, password: string, roleId: string): Promise<User> {
    const url = this.getUrl("/users");

    try {
      const body: CreateUserDto = {
        email,
        password,
        roleId,
      };

      const response = await $fetch<ApiResponse<UserDto>>(
        url,
        withAuthHeaders({
          method: "POST" as const,
          body,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al crear usuario");
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
      const message = error?.data?.message ?? error?.message ?? "Error al crear usuario";
      throw new Error(message);
    }
  }

  /**
   * Elimina (desactiva) un usuario
   */
  async deleteUser(userId: string): Promise<void> {
    const url = this.getUrl(`/users/${userId}`);

    try {
      const response = await $fetch<ApiResponse<boolean>>(
        url,
        withAuthHeaders({
          method: "DELETE" as const,
        })
      );

      if (!response.success) {
        throw new Error(response.message || "Error al eliminar usuario");
      }
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "Error al eliminar usuario";
      throw new Error(message);
    }
  }

  /**
   * Actualiza el estado (activo/inactivo) de un usuario
   */
  async updateUserStatus(userId: string, status: boolean): Promise<User> {
    const url = this.getUrl(`/users/${userId}/status`);

    try {
      const body: UpdateUserStatusDto = {
        status,
      };

      const response = await $fetch<ApiResponse<UserDto>>(
        url,
        withAuthHeaders({
          method: "PATCH" as const,
          body,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al actualizar estado");
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
      const message = error?.data?.message ?? error?.message ?? "Error al actualizar estado";
      throw new Error(message);
    }
  }
}
