import type { FetchOptions } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type {
  CreateDesignationAttorneyDTO,
  DesignationAttorneyActionResponse,
  DesignationAttorneyListResponse,
  DesignationAttorneyResponseDTO,
  UpdateDesignationAttorneyDTO,
} from "../../application/dtos/designation-attorney.dto";
import type { DesignationAttorneyRepository } from "../../domain/ports/designation-attorney.repository";
import { DesignationAttorneyMapper } from "../mappers/designation-attorney.mapper";

/**
 * Implementación HTTP del repositorio de Designación de Apoderados
 *
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/designation-attorney
 */
export class DesignationAttorneyHttpRepository implements DesignationAttorneyRepository {
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
   * Resuelve la URL para designation-attorney
   */
  private resolveDesignationAttorneyUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/designation-attorney`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * GET - Listar apoderados designados
   */
  async list(societyId: number, flowId: number): Promise<DesignationAttorneyResponseDTO[]> {
    const url = this.resolveDesignationAttorneyUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][DesignationAttorneyHttp] list() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<DesignationAttorneyListResponse>(url, requestConfig);

      console.debug("[Repository][DesignationAttorneyHttp] list() response", {
        success: response?.success,
        hasData: !!response?.data,
        count: response?.data?.length ?? 0,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al listar apoderados designados");
      }

      return response.data;
    } catch (error: any) {
      console.error("[Repository][DesignationAttorneyHttp] list() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }

  /**
   * POST - Crear nuevo apoderado (para nombramiento)
   */
  async create(
    societyId: number,
    flowId: number,
    dto: CreateDesignationAttorneyDTO
  ): Promise<void> {
    const url = this.resolveDesignationAttorneyUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };

    // Transformar DTO interno a estructura que espera el backend
    const backendPayload = DesignationAttorneyMapper.toBackendRequest(dto, "CANDIDATO");

    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
      body: backendPayload,
    };

    console.debug("[Repository][DesignationAttorneyHttp] create() request", {
      url,
      societyId,
      flowId,
      dto,
      backendPayload,
    });

    try {
      const response = await $fetch<DesignationAttorneyActionResponse>(url, requestConfig);

      console.debug("[Repository][DesignationAttorneyHttp] create() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response.success) {
        throw new Error(response.message || "Error al crear apoderado designado");
      }
    } catch (error: any) {
      console.error("[Repository][DesignationAttorneyHttp] create() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }

  /**
   * PUT - Actualizar estado de apoderado designado
   */
  async update(
    societyId: number,
    flowId: number,
    dto: UpdateDesignationAttorneyDTO
  ): Promise<void> {
    const url = this.resolveDesignationAttorneyUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };

    // Transformar DTO interno a estructura que espera el backend
    // ⚠️ Esto elimina campos de cónyuge y asegura strings vacíos
    const backendPayload = DesignationAttorneyMapper.toBackendUpdateRequest(dto);

    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body: backendPayload,
    };

    console.debug("[Repository][DesignationAttorneyHttp] update() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<DesignationAttorneyActionResponse>(url, requestConfig);

      console.debug("[Repository][DesignationAttorneyHttp] update() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response.success) {
        throw new Error(response.message || "Error al actualizar apoderado designado");
      }
    } catch (error: any) {
      console.error("[Repository][DesignationAttorneyHttp] update() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }

  /**
   * DELETE - Eliminar apoderado designado
   */
  async delete(societyId: number, flowId: number, designationId: string): Promise<void> {
    const baseUrl = this.resolveDesignationAttorneyUrl(societyId, flowId);
    const url = `${baseUrl}/${designationId}`;
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
    };

    console.debug("[Repository][DesignationAttorneyHttp] delete() request", {
      url,
      societyId,
      flowId,
      designationId,
    });

    try {
      const response = await $fetch<DesignationAttorneyActionResponse>(url, requestConfig);

      console.debug("[Repository][DesignationAttorneyHttp] delete() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response.success) {
        throw new Error(response.message || "Error al eliminar apoderado designado");
      }
    } catch (error: any) {
      console.error("[Repository][DesignationAttorneyHttp] delete() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }
}
