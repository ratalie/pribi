import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { AccessArea } from '../../domain/entities/access-area.entity';
import type { UserOverride } from '../../domain/entities/user-override.entity';
import type { AccessAreaDto } from '../../application/dtos/access-area.dto';
import type { UserOverrideDto } from '../../application/dtos/user-override.dto';
import { withAuthHeaders } from '~/core/shared/http/with-auth-headers';
import { AccessAreaMapper } from '../mappers/access-area.mapper';
import { UserOverrideMapper } from '../mappers/user-override.mapper';

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
 * Implementación HTTP del repositorio de permisos
 */
export class PermissionsHttpRepository implements PermissionsRepository {
  private readonly basePath = '/api/v1/access-management';

  /**
   * Obtiene los accesos efectivos de un usuario (árbol V2 filtrado)
   */
  async getUserAccess(userId: string): Promise<AccessArea[]> {
    const url = `${this.basePath}/users/${userId}/access`;

    try {
      const response = await $fetch<ApiResponse<AccessArea[]>>(
        url,
        withAuthHeaders({
          method: 'GET',
        }),
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al obtener accesos del usuario');
      }

      // Mapear DTOs a entidades
      return response.data.map(AccessAreaMapper.toDomain);
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? 'Error al obtener accesos del usuario';
      throw new Error(message);
    }
  }

  /**
   * Obtiene los accesos completos de un usuario (incluye deshabilitados)
   */
  async getUserAccessFull(userId: string): Promise<AccessArea[]> {
    const url = `${this.basePath}/users/${userId}/access/full`;

    try {
      const response = await $fetch<ApiResponse<AccessArea[]>>(
        url,
        withAuthHeaders({
          method: 'GET',
        }),
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al obtener accesos completos del usuario');
      }

      // Mapear DTOs a entidades
      return response.data.map(AccessAreaMapper.toDomain);
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.message ??
        'Error al obtener accesos completos del usuario';
      throw new Error(message);
    }
  }

  /**
   * Obtiene mis propios accesos efectivos
   */
  async getMyAccess(): Promise<AccessArea[]> {
    const url = `${this.basePath}/me/access`;

    try {
      const response = await $fetch<ApiResponse<AccessArea[]>>(
        url,
        withAuthHeaders({
          method: 'GET',
        }),
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al obtener mis accesos');
      }

      // Mapear DTOs a entidades
      return response.data.map(AccessAreaMapper.toDomain);
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? 'Error al obtener mis accesos';
      throw new Error(message);
    }
  }

  /**
   * Actualiza los overrides de permisos de un usuario
   * 
   * Acepta tanto UserOverride[] (formato legacy) como el DTO directo del backend
   */
  async updateUserOverrides(
    userId: string,
    overrides: UserOverride[] | { overrides: any[] },
  ): Promise<void> {
    const url = `${this.basePath}/users/${userId}/access`;

    try {
      let dto: { overrides: any[] };

      // Si ya viene en formato DTO, usarlo directamente
      if ('overrides' in overrides) {
        dto = overrides as { overrides: any[] };
      } else {
        // Convertir entidades a DTOs (formato legacy)
        dto = UserOverrideMapper.toDto(overrides as UserOverride[]);
      }

      const response = await $fetch<ApiResponse<boolean>>(
        url,
        withAuthHeaders({
          method: 'PUT',
          body: dto,
        }),
      );

      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar overrides de permisos');
      }
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.message ??
        'Error al actualizar overrides de permisos';
      throw new Error(message);
    }
  }

  /**
   * Obtiene la whitelist de módulos del estudio
   */
  async getStudyWhitelist(studyId: string): Promise<string[]> {
    const url = `/api/v1/superadmin/studies/${studyId}/modules`;

    try {
      const response = await $fetch<ApiResponse<{ modules: string[] }>>(
        url,
        withAuthHeaders({
          method: 'GET',
        }),
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al obtener whitelist del estudio');
      }

      return response.data.modules || [];
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? 'Error al obtener whitelist del estudio';
      throw new Error(message);
    }
  }

  /**
   * Actualiza la whitelist de módulos del estudio
   */
  async updateStudyWhitelist(studyId: string, modules: string[]): Promise<void> {
    const url = `/api/v1/superadmin/studies/${studyId}/modules`;

    try {
      const response = await $fetch<ApiResponse<boolean>>(
        url,
        withAuthHeaders({
          method: 'PUT',
          body: { modules },
        }),
      );

      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar whitelist del estudio');
      }
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? 'Error al actualizar whitelist del estudio';
      throw new Error(message);
    }
  }
}




