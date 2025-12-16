import type { FetchOptions } from "ofetch";
import type { RemovalAttorneyRepository } from "../../domain/ports/removal-attorney.repository";
import type {
  RemovalAttorneyResponseDTO,
  CreateRemovalAttorneyDTO,
  UpdateRemovalAttorneyDTO,
  RemovalAttorneyListResponse,
  RemovalAttorneyActionResponse,
} from "../../application/dtos/removal-attorney.dto";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

/**
 * Implementación HTTP del repositorio de Remoción de Apoderados
 * 
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-attorney
 */
export class RemovalAttorneyHttpRepository implements RemovalAttorneyRepository {
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
   * Resuelve la URL para removal-attorney
   */
  private resolveRemovalAttorneyUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/removal-attorney`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * GET - Listar apoderados disponibles para remoción
   */
  async list(societyId: number, flowId: number): Promise<RemovalAttorneyResponseDTO[]> {
    const url = this.resolveRemovalAttorneyUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][RemovalAttorneyHttp] list() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<RemovalAttorneyListResponse>(url, requestConfig);

      console.debug("[Repository][RemovalAttorneyHttp] list() response", {
        success: response?.success,
        hasData: !!response?.data,
        count: response?.data?.length ?? 0,
      });

      if (!response?.success || !response?.data) {
        console.warn(
          "[Repository][RemovalAttorneyHttp] Backend NO devolvió data o success=false"
        );
        return [];
      }

      return response.data;
    } catch (error: any) {
      // Si es 404, no hay apoderados (es normal)
      if (error.statusCode === 404 || error.status === 404) {
        console.debug(
          "[Repository][RemovalAttorneyHttp] No hay apoderados para remoción (404), retornando []"
        );
        return [];
      }

      console.error("[Repository][RemovalAttorneyHttp] list() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
      });
      throw error;
    }
  }

  /**
   * POST - Crear candidato a remoción
   */
  async createCandidate(
    societyId: number,
    flowId: number,
    dto: CreateRemovalAttorneyDTO
  ): Promise<void> {
    const url = this.resolveRemovalAttorneyUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
      body: dto,
    };

    console.debug("[Repository][RemovalAttorneyHttp] createCandidate() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<RemovalAttorneyActionResponse>(url, requestConfig);

      console.debug("[Repository][RemovalAttorneyHttp] createCandidate() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Error al crear candidato a remoción de apoderado"
        );
      }
    } catch (error: any) {
      console.error("[Repository][RemovalAttorneyHttp] createCandidate() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        dto,
      });
      throw error;
    }
  }

  /**
   * PUT - Actualizar estado de candidato
   */
  async updateCandidate(
    societyId: number,
    flowId: number,
    dto: UpdateRemovalAttorneyDTO
  ): Promise<void> {
    const url = this.resolveRemovalAttorneyUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body: dto,
    };

    console.debug("[Repository][RemovalAttorneyHttp] updateCandidate() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<RemovalAttorneyActionResponse>(url, requestConfig);

      console.debug("[Repository][RemovalAttorneyHttp] updateCandidate() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Error al actualizar estado de candidato"
        );
      }
    } catch (error: any) {
      console.error("[Repository][RemovalAttorneyHttp] updateCandidate() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        dto,
      });
      throw error;
    }
  }
}

