import type { FetchOptions } from "ofetch";
import type { CreditCapitalizationRepository } from "../../domain/ports/credit-capitalization.repository";
import type {
  CreditCapitalizationResponseDTO,
  CreateCreditCapitalizationDTO,
  UpdateCreditCapitalizationDTO,
  CreditCapitalizationListResponse,
  CreditCapitalizationCreateResponse,
  CreditCapitalizationActionResponse,
} from "../../application/dtos/credit-capitalization.dto";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { CreditCapitalization } from "../../domain/entities/credit-capitalization.entity";
import { CreditCapitalizationMapper } from "../mappers/credit-capitalization.mapper";

/**
 * Implementación HTTP del repositorio de Capitalizaciones de Crédito
 *
 * Endpoints v1:
 * - GET /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
 * - POST /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
 * - PUT /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
 * - DELETE /api/v1/society-profile/:societyId/flow/:flowId/credit-capitalization
 *
 * ⚠️ NOTA: Actualmente solo existe en v1. En v2 sería:
 * - /api/v2/society-profile/:societyId/register-assembly/:flowId/capitalizations
 */
export class CreditCapitalizationHttpRepository
  implements CreditCapitalizationRepository
{
  private readonly basePath = "/api/v1/society-profile";

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
   * Resuelve la URL para credit-capitalization
   */
  private resolveCapitalizationUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/flow/${flowId}/credit-capitalization`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * GET - Listar todas las capitalizaciones
   */
  async list(societyId: number, flowId: number): Promise<CreditCapitalization[]> {
    const url = this.resolveCapitalizationUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][CreditCapitalizationHttp] list() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<CreditCapitalizationListResponse>(
        url,
        requestConfig
      );

      console.debug("[Repository][CreditCapitalizationHttp] list() response", {
        success: response?.success,
        hasData: !!response?.data,
        count: response?.data?.length ?? 0,
      });

      if (!response?.success || !response?.data) {
        console.warn(
          "[Repository][CreditCapitalizationHttp] Backend NO devolvió data o success=false"
        );
        return [];
      }

      // Mapear DTOs a entidades
      return response.data.map((dto) =>
        CreditCapitalizationMapper.fromResponseDto(dto)
      );
    } catch (error: any) {
      // Si es 404, no hay capitalizaciones (es normal)
      if (error.statusCode === 404 || error.status === 404) {
        console.debug(
          "[Repository][CreditCapitalizationHttp] No hay capitalizaciones (404), retornando []"
        );
        return [];
      }

      console.error("[Repository][CreditCapitalizationHttp] list() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
      });
      throw error;
    }
  }

  /**
   * POST - Crear una nueva capitalización
   */
  async create(
    societyId: number,
    flowId: number,
    dto: CreateCreditCapitalizationDTO
  ): Promise<CreditCapitalization> {
    const url = this.resolveCapitalizationUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
      body: dto,
    };

    console.debug("[Repository][CreditCapitalizationHttp] create() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<CreditCapitalizationCreateResponse>(
        url,
        requestConfig
      );

      console.debug("[Repository][CreditCapitalizationHttp] create() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success || !response?.data) {
        throw new Error(
          response?.message || "Error al crear capitalización"
        );
      }

      // Mapear DTO a entidad
      return CreditCapitalizationMapper.fromResponseDto(response.data);
    } catch (error: any) {
      console.error("[Repository][CreditCapitalizationHttp] create() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        dto,
      });
      throw error;
    }
  }

  /**
   * PUT - Actualizar una capitalización existente
   */
  async update(
    societyId: number,
    flowId: number,
    dto: UpdateCreditCapitalizationDTO
  ): Promise<void> {
    const url = this.resolveCapitalizationUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body: dto,
    };

    console.debug("[Repository][CreditCapitalizationHttp] update() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<CreditCapitalizationActionResponse>(
        url,
        requestConfig
      );

      console.debug("[Repository][CreditCapitalizationHttp] update() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Error al actualizar capitalización"
        );
      }
    } catch (error: any) {
      console.error("[Repository][CreditCapitalizationHttp] update() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        dto,
      });
      throw error;
    }
  }

  /**
   * DELETE - Eliminar una o más capitalizaciones
   */
  async delete(
    societyId: number,
    flowId: number,
    capitalizationIds: string[]
  ): Promise<void> {
    const url = this.resolveCapitalizationUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
      body: capitalizationIds,
    };

    console.debug("[Repository][CreditCapitalizationHttp] delete() request", {
      url,
      societyId,
      flowId,
      capitalizationIds,
    });

    try {
      const response = await $fetch<CreditCapitalizationActionResponse>(
        url,
        requestConfig
      );

      console.debug("[Repository][CreditCapitalizationHttp] delete() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Error al eliminar capitalizaciones"
        );
      }
    } catch (error: any) {
      console.error("[Repository][CreditCapitalizationHttp] delete() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        capitalizationIds,
      });
      throw error;
    }
  }
}


