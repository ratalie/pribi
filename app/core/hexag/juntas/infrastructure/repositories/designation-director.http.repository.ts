import type { FetchOptions } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type {
  CreateDesignationDirectorDTO,
  DesignationDirectorActionResponse,
  DesignationDirectorListResponse,
  DesignationDirectorResponseDTO,
  UpdateDesignationDirectorDTO,
} from "../../application/dtos/designation-director.dto";
import type { DesignationDirectorRepository } from "../../domain/ports/designation-director.repository";
import { DesignationDirectorMapper } from "../mappers/designation-director.mapper";

/**
 * Implementación HTTP del repositorio de Designación de Directores
 *
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director?actionType=DESIGNATION
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-director
 */
export class DesignationDirectorHttpRepository implements DesignationDirectorRepository {
  private readonly basePath = "/api/v2/society-profile";

  /**
   * Resuelve la URL base
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        return new URL(base, origin || "http://localhost:3000").origin;
      } catch {
        continue;
      }
    }
    return "";
  }

  /**
   * Resuelve la URL para designation-director
   */
  private resolveDesignationDirectorUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/designation-director`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * GET - Listar directores designados
   */
  async list(societyId: number, flowId: number): Promise<DesignationDirectorResponseDTO[]> {
    const baseUrl = this.resolveDesignationDirectorUrl(societyId, flowId);
    const url = `${baseUrl}?actionType=DESIGNATION`;
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][DesignationDirectorHttp] list() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<DesignationDirectorListResponse>(url, requestConfig);

      console.debug("[Repository][DesignationDirectorHttp] list() response", {
        success: response?.success,
        hasData: !!response?.data,
        count: response?.data?.length ?? 0,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al listar directores designados");
      }

      // ⚠️ IMPORTANTE: El GET devuelve campos en INGLÉS, necesitamos mapearlos al DTO interno
      const mappedData = DesignationDirectorMapper.fromBackendResponseArray(response.data);

      console.debug("[Repository][DesignationDirectorHttp] list() mapeado:", {
        originalCount: response.data.length,
        mappedCount: mappedData.length,
      });

      return mappedData;
    } catch (error: any) {
      console.error("[Repository][DesignationDirectorHttp] list() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }

  /**
   * POST - Crear nuevo director (para nombramiento)
   */
  async create(
    societyId: number,
    flowId: number,
    dto: CreateDesignationDirectorDTO
  ): Promise<void> {
    const url = this.resolveDesignationDirectorUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };

    // Transformar DTO interno a estructura que espera el backend
    const backendPayload = DesignationDirectorMapper.toBackendRequest(dto);

    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
      body: backendPayload,
    };

    console.debug("[Repository][DesignationDirectorHttp] create() request", {
      url,
      societyId,
      flowId,
      dto,
      backendPayload,
    });

    try {
      const response = await $fetch<DesignationDirectorActionResponse>(url, requestConfig);

      console.debug("[Repository][DesignationDirectorHttp] create() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response.success) {
        throw new Error(response.message || "Error al crear director designado");
      }
    } catch (error: any) {
      console.error("[Repository][DesignationDirectorHttp] create() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }

  /**
   * PUT - Actualizar estado de director designado
   */
  async update(
    societyId: number,
    flowId: number,
    dto: UpdateDesignationDirectorDTO
  ): Promise<void> {
    const url = this.resolveDesignationDirectorUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };

    // Transformar DTO interno a estructura que espera el backend
    // Si hay datos personales, necesitamos el directorRole del director original
    // Por ahora, obtenemos el directorRole del DTO si está disponible en alguna propiedad adicional
    // Esto es una solución temporal - idealmente deberíamos pasar directorRole como parámetro separado
    const directorRole = (dto as any).directorRole as
      | "TITULAR"
      | "SUPLENTE"
      | "ALTERNO"
      | undefined;
    const backendPayload = DesignationDirectorMapper.toBackendUpdateRequest(dto, directorRole);

    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body: backendPayload,
    };

    console.debug("[Repository][DesignationDirectorHttp] update() request", {
      url,
      societyId,
      flowId,
      dto,
      backendPayload,
    });

    try {
      const response = await $fetch<DesignationDirectorActionResponse>(url, requestConfig);

      console.debug("[Repository][DesignationDirectorHttp] update() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response.success) {
        throw new Error(response.message || "Error al actualizar director designado");
      }
    } catch (error: any) {
      console.error("[Repository][DesignationDirectorHttp] update() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }

  /**
   * DELETE - Eliminar director designado
   * ⚠️ IMPORTANTE: El DELETE se hace con body (array de IDs), NO por ruta
   */
  async delete(societyId: number, flowId: number, designationId: string): Promise<void> {
    const url = this.resolveDesignationDirectorUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
      body: [designationId], // ✅ Enviar array de IDs en el body
    };

    console.debug("[Repository][DesignationDirectorHttp] delete() request", {
      url,
      societyId,
      flowId,
      designationId,
      body: [designationId],
    });

    try {
      const response = await $fetch<DesignationDirectorActionResponse>(url, requestConfig);

      console.debug("[Repository][DesignationDirectorHttp] delete() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response.success) {
        throw new Error(response.message || "Error al eliminar director designado");
      }
    } catch (error: any) {
      console.error("[Repository][DesignationDirectorHttp] delete() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }
}
