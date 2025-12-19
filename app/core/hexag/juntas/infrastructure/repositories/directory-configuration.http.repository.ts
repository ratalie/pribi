import type { FetchOptions } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type {
  DirectoryConfigurationGetResponse,
  DirectoryConfigurationResponseDTO,
  DirectoryConfigurationUpdateResponse,
  UpdateDirectoryConfigurationDTO,
} from "../../application/dtos/directory-configuration.dto";
import type { DirectoryConfigurationRepository } from "../../domain/ports/directory-configuration.repository";
import { DirectoryConfigurationMapper } from "../mappers/directory-configuration.mapper";

/**
 * Implementación HTTP del repositorio de Configuración de Directorio en Juntas
 *
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/directorio
 *
 * ⚠️ IMPORTANTE: Estos endpoints actualizan el directorio del SNAPSHOT (no el directorio base)
 */
export class DirectoryConfigurationHttpRepository implements DirectoryConfigurationRepository {
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
   * Resuelve la URL para directory-configuration (con flowId)
   */
  private resolveDirectoryConfigurationUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/directorio`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * GET - Obtener configuración de directorio del snapshot
   */
  async get(societyId: number, flowId: number): Promise<DirectoryConfigurationResponseDTO> {
    const url = this.resolveDirectoryConfigurationUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][DirectoryConfigurationHttp] get() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<DirectoryConfigurationGetResponse>(url, requestConfig);

      console.debug("[Repository][DirectoryConfigurationHttp] get() response", {
        success: response?.success,
        hasData: !!response?.data,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Error al obtener configuración de directorio");
      }

      // Mapear respuesta del backend a DTO interno
      const mappedData = DirectoryConfigurationMapper.fromBackendResponse(response.data);

      console.debug("[Repository][DirectoryConfigurationHttp] get() mapeado:", {
        original: response.data,
        mapped: mappedData,
      });

      return mappedData;
    } catch (error: any) {
      console.error("[Repository][DirectoryConfigurationHttp] get() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }

  /**
   * PUT - Actualizar configuración de directorio del snapshot
   * ⚠️ IMPORTANTE: Todos los campos son opcionales - Solo se envían los campos que se necesiten actualizar
   */
  async update(
    societyId: number,
    flowId: number,
    dto: UpdateDirectoryConfigurationDTO
  ): Promise<void> {
    const url = this.resolveDirectoryConfigurationUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };

    // Transformar DTO interno a estructura que espera el backend
    // Solo incluye los campos que están definidos
    const backendPayload = DirectoryConfigurationMapper.toBackendRequest(dto);

    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body: backendPayload,
    };

    console.debug("[Repository][DirectoryConfigurationHttp] update() request", {
      url,
      societyId,
      flowId,
      dto,
      backendPayload,
    });

    try {
      const response = await $fetch<DirectoryConfigurationUpdateResponse>(url, requestConfig);

      console.debug("[Repository][DirectoryConfigurationHttp] update() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response.success) {
        throw new Error(response.message || "Error al actualizar configuración de directorio");
      }
    } catch (error: any) {
      console.error("[Repository][DirectoryConfigurationHttp] update() error", {
        url,
        error: error.message || error,
        status: error.status || error.statusCode,
      });
      throw error;
    }
  }
}
