import type { FetchOptions } from "ofetch";
import type { CreditorRepository } from "../../domain/ports/creditor.repository";
import type {
  CreditorResponseDTO,
  CreateCreditorDTO,
  UpdateCreditorDTO,
  CreditorListResponse,
  CreditorCreateResponse,
  CreditorActionResponse,
} from "../../application/dtos/creditor.dto";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { Creditor } from "../../domain/entities/creditor.entity";
import { CreditorMapper } from "../mappers/creditor.mapper";

/**
 * Implementación HTTP del repositorio de Acreedores
 *
 * Endpoints v1:
 * - GET /api/v1/society-profile/:societyId/flow/:flowId/creditors
 * - POST /api/v1/society-profile/:societyId/flow/:flowId/creditors
 * - PUT /api/v1/society-profile/:societyId/flow/:flowId/creditors
 * - DELETE /api/v1/society-profile/:societyId/flow/:flowId/creditors
 *
 * ⚠️ NOTA: Actualmente solo existe en v1. En v2 sería:
 * - /api/v2/society-profile/:societyId/register-assembly/:flowId/creditors
 */
export class CreditorHttpRepository implements CreditorRepository {
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
   * Resuelve la URL para creditors
   */
  private resolveCreditorsUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/flow/${flowId}/creditors`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * GET - Listar todos los acreedores
   */
  async list(societyId: number, flowId: number): Promise<Creditor[]> {
    const url = this.resolveCreditorsUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][CreditorHttp] list() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<CreditorListResponse>(url, requestConfig);

      console.debug("[Repository][CreditorHttp] list() response", {
        success: response?.success,
        hasData: !!response?.data,
        count: response?.data?.length ?? 0,
      });

      if (!response?.success || !response?.data) {
        console.warn(
          "[Repository][CreditorHttp] Backend NO devolvió data o success=false"
        );
        return [];
      }

      // Mapear DTOs a entidades
      return response.data.map((dto) => CreditorMapper.fromResponseDto(dto));
    } catch (error: any) {
      // Si es 404, no hay acreedores (es normal)
      if (error.statusCode === 404 || error.status === 404) {
        console.debug(
          "[Repository][CreditorHttp] No hay acreedores (404), retornando []"
        );
        return [];
      }

      console.error("[Repository][CreditorHttp] list() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
      });
      throw error;
    }
  }

  /**
   * POST - Crear un nuevo acreedor
   */
  async create(
    societyId: number,
    flowId: number,
    dto: CreateCreditorDTO
  ): Promise<Creditor> {
    const url = this.resolveCreditorsUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
      body: dto,
    };

    console.debug("[Repository][CreditorHttp] create() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<CreditorCreateResponse>(url, requestConfig);

      console.debug("[Repository][CreditorHttp] create() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success || !response?.data) {
        throw new Error(
          response?.message || "Error al crear acreedor"
        );
      }

      // Mapear DTO a entidad
      return CreditorMapper.fromResponseDto(response.data);
    } catch (error: any) {
      console.error("[Repository][CreditorHttp] create() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        dto,
      });
      throw error;
    }
  }

  /**
   * PUT - Actualizar un acreedor existente
   */
  async update(
    societyId: number,
    flowId: number,
    dto: UpdateCreditorDTO
  ): Promise<void> {
    const url = this.resolveCreditorsUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body: dto,
    };

    console.debug("[Repository][CreditorHttp] update() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      const response = await $fetch<CreditorActionResponse>(url, requestConfig);

      console.debug("[Repository][CreditorHttp] update() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Error al actualizar acreedor"
        );
      }
    } catch (error: any) {
      console.error("[Repository][CreditorHttp] update() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        dto,
      });
      throw error;
    }
  }

  /**
   * DELETE - Eliminar uno o más acreedores
   */
  async delete(
    societyId: number,
    flowId: number,
    creditorIds: string[]
  ): Promise<void> {
    const url = this.resolveCreditorsUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
      body: creditorIds,
    };

    console.debug("[Repository][CreditorHttp] delete() request", {
      url,
      societyId,
      flowId,
      creditorIds,
    });

    try {
      const response = await $fetch<CreditorActionResponse>(url, requestConfig);

      console.debug("[Repository][CreditorHttp] delete() response", {
        success: response?.success,
        message: response?.message,
        code: response?.code,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Error al eliminar acreedores"
        );
      }
    } catch (error: any) {
      console.error("[Repository][CreditorHttp] delete() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
        creditorIds,
      });
      throw error;
    }
  }
}




