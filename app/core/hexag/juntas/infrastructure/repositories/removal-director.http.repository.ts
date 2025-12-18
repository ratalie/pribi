import type { FetchOptions } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type {
  CreateRemovalDirectorDTO,
  RemovalDirectorActionResponse,
  RemovalDirectorListResponse,
  RemovalDirectorResponseDTO,
  UpdateRemovalDirectorDTO,
} from "../../application/dtos/removal-director.dto";
import type { RemovalDirectorRepository } from "../../domain/ports/removal-director.repository";
import { RemovalDirectorMapper } from "../mappers/removal-director.mapper";

/**
 * Implementación HTTP del repositorio de Remoción de Directores
 *
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/removal-director
 */
export class RemovalDirectorHttpRepository implements RemovalDirectorRepository {
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
   * Resuelve la URL para removal-director
   */
  private resolveRemovalDirectorUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/removal-director`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * GET - Listar directores disponibles para remoción
   */
  async list(societyId: number, flowId: number): Promise<RemovalDirectorResponseDTO[]> {
    const url = this.resolveRemovalDirectorUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][RemovalDirectorHttp] list() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<RemovalDirectorListResponse>(url, requestConfig);

      console.debug("[Repository][RemovalDirectorHttp] list() response", {
        success: response?.success,
        hasData: !!response?.data,
        count: response?.data?.length ?? 0,
      });

      if (!response?.success || !response?.data) {
        console.warn(
          "[Repository][RemovalDirectorHttp] Backend NO devolvió data o success=false"
        );
        return [];
      }

      // Mapear respuesta del backend al DTO esperado
      const mappedData = RemovalDirectorMapper.fromBackendResponseArray(response.data);

      console.debug("[Repository][RemovalDirectorHttp] Directores mapeados:", {
        originalCount: response.data.length,
        mappedCount: mappedData.length,
      });

      return mappedData;
    } catch (error: any) {
      // Si es 404, no hay directores (es normal)
      if (error.statusCode === 404 || error.status === 404) {
        console.debug(
          "[Repository][RemovalDirectorHttp] No hay directores para remoción (404), retornando []"
        );
        return [];
      }

      console.error("[Repository][RemovalDirectorHttp] list() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
      });
      throw error;
    }
  }

  /**
   * PUT - Crear/Actualizar candidato a remoción
   * ✅ PUT hace TODO: crear, actualizar, desmarcar
   */
  async createCandidate(
    societyId: number,
    flowId: number,
    dto: CreateRemovalDirectorDTO
  ): Promise<void> {
    const url = this.resolveRemovalDirectorUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "PUT" as const, // ✅ Cambiado a PUT (hace crear y actualizar)
      body: dto,
    };

    console.debug("[Repository][RemovalDirectorHttp] createCandidate() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<RemovalDirectorActionResponse>(url, requestConfig);

      console.debug("[Repository][RemovalDirectorHttp] createCandidate() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Error al crear candidato a remoción de director"
        );
      }
    } catch (error: any) {
      console.error("[Repository][RemovalDirectorHttp] createCandidate() error", {
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
    dto: UpdateRemovalDirectorDTO
  ): Promise<void> {
    const url = this.resolveRemovalDirectorUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body: dto,
    };

    console.debug("[Repository][RemovalDirectorHttp] updateCandidate() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<RemovalDirectorActionResponse>(url, requestConfig);

      console.debug("[Repository][RemovalDirectorHttp] updateCandidate() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Error al actualizar estado de candidato");
      }
    } catch (error: any) {
      console.error("[Repository][RemovalDirectorHttp] updateCandidate() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        dto,
      });
      throw error;
    }
  }
}
