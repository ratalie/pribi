import type { PermissionsRepository } from "../../domain/ports/permissions.repository";
import type { AccessArea } from "../../domain/entities/access-area.entity";
import type { UserOverride } from "../../domain/entities/user-override.entity";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { AccessAreaMapper } from "../mappers/access-area.mapper";
import { UserOverrideMapper } from "../mappers/user-override.mapper";

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
        console.warn(`[PermissionsHttpRepository] URL base inválida: ${base}`, error);
        continue;
      }
    }

    // Fallback seguro
    const fallback = origin || "http://localhost:3000";
    console.warn(`[PermissionsHttpRepository] Usando URL fallback: ${fallback}`);
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
      console.error(`[PermissionsHttpRepository] Error al construir URL para path: ${path}`, error);
      // Fallback seguro
      const fallback = `http://localhost:3000${this.basePath}${path.startsWith("/") ? path : `/${path}`}`;
      console.warn(`[PermissionsHttpRepository] Usando URL fallback: ${fallback}`);
      return fallback;
    }
  }

  /**
   * Construye la URL completa para endpoints de superadmin
   */
  private getSuperadminUrl(path: string): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = "/api/v2/superadmin";
    const fullPath = `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * Obtiene los accesos efectivos de un usuario (árbol V2 filtrado)
   */
  async getUserAccess(userId: string): Promise<AccessArea[]> {
    const url = this.getUrl(`/users/${userId}/access`);

    try {
      const response = await $fetch<ApiResponse<AccessArea[]>>(
        url,
        withAuthHeaders({
          method: "GET" as const,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al obtener accesos del usuario");
      }

      // Mapear DTOs a entidades
      return response.data.map(AccessAreaMapper.toDomain);
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? "Error al obtener accesos del usuario";
      throw new Error(message);
    }
  }

  /**
   * Obtiene los accesos completos de un usuario (incluye deshabilitados)
   */
  async getUserAccessFull(userId: string): Promise<AccessArea[]> {
    const url = this.getUrl(`/users/${userId}/access/full`);

    try {
      const response = await $fetch<ApiResponse<AccessArea[]>>(
        url,
        withAuthHeaders({
          method: "GET" as const,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al obtener accesos completos del usuario");
      }

      // Mapear DTOs a entidades
      return response.data.map(AccessAreaMapper.toDomain);
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.message ??
        "Error al obtener accesos completos del usuario";
      throw new Error(message);
    }
  }

  /**
   * Obtiene mis propios accesos efectivos
   */
  async getMyAccess(): Promise<AccessArea[]> {
    const url = this.getUrl("/me/access");

    try {
      const response = await $fetch<ApiResponse<AccessArea[]>>(
        url,
        withAuthHeaders({
          method: "GET" as const,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al obtener mis accesos");
      }

      // Mapear DTOs a entidades
      return response.data.map(AccessAreaMapper.toDomain);
    } catch (error: any) {
      const message = error?.data?.message ?? error?.message ?? "Error al obtener mis accesos";
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
    overrides: UserOverride[] | { overrides: any[] }
  ): Promise<void> {
    const url = this.getUrl(`/users/${userId}/access`);

    try {
      let dto: { overrides: any[] };

      // Si ya viene en formato DTO, usarlo directamente
      if ("overrides" in overrides) {
        dto = overrides as { overrides: any[] };
      } else {
        // Convertir entidades a DTOs (formato legacy)
        dto = UserOverrideMapper.toDto(overrides as UserOverride[]);
      }

      const response = await $fetch<ApiResponse<boolean>>(
        url,
        withAuthHeaders({
          method: "PUT" as const,
          body: dto,
        })
      );

      if (!response.success) {
        throw new Error(response.message || "Error al actualizar overrides de permisos");
      }
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? "Error al actualizar overrides de permisos";
      throw new Error(message);
    }
  }

  /**
   * Obtiene la whitelist de módulos del estudio
   */
  async getStudyWhitelist(studyId: string): Promise<string[]> {
    const url = this.getSuperadminUrl(`/studies/${studyId}/modules`);

    try {
      const response = await $fetch<ApiResponse<{ modules: string[] }>>(
        url,
        withAuthHeaders({
          method: "GET" as const,
        })
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al obtener whitelist del estudio");
      }

      return response.data.modules || [];
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? "Error al obtener whitelist del estudio";
      throw new Error(message);
    }
  }

  /**
   * Actualiza la whitelist de módulos del estudio
   */
  async updateStudyWhitelist(studyId: string, modules: string[]): Promise<void> {
    const url = this.getSuperadminUrl(`/studies/${studyId}/modules`);

    try {
      const response = await $fetch<ApiResponse<boolean>>(
        url,
        withAuthHeaders({
          method: "PUT" as const,
          body: { modules },
        })
      );

      if (!response.success) {
        throw new Error(response.message || "Error al actualizar whitelist del estudio");
      }
    } catch (error: any) {
      const message =
        error?.data?.message ?? error?.message ?? "Error al actualizar whitelist del estudio";
      throw new Error(message);
    }
  }
}
