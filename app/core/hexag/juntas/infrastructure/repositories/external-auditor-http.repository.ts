import { $fetch } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { ExternalAuditorDTO } from "../../application/dtos/external-auditor.dto";
import type { ExternalAuditorRepository } from "../../domain/ports/external-auditor.repository";

/**
 * HTTP Repository para External Auditor
 *
 * Implementa el contrato del repository usando HTTP
 */
export class ExternalAuditorHttpRepository implements ExternalAuditorRepository {
  private readonly basePath = "/api/v2/society-profile";

  /**
   * Resolver la URL base correcta
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        return baseUrl.origin;
      } catch {
        continue;
      }
    }

    return origin || "http://localhost:3000";
  }

  /**
   * Construir la URL completa para el endpoint
   */
  private getUrl(societyId: number, flowId: number): string {
    const baseUrl = this.resolveBaseUrl();
    const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
    const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/external-auditors`;
    return new URL(fullPath, baseUrl).toString();
  }

  /**
   * Crear designación de auditor externo
   */
  async crear(societyId: number, flowId: number, dto: ExternalAuditorDTO): Promise<void> {
    const url = this.getUrl(societyId, flowId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: dto,
    });

    console.debug("[Repository][ExternalAuditor] crear() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      await $fetch(url, config);
      console.debug("[Repository][ExternalAuditor] crear() success");
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const errorMessage =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";

      console.error("[Repository][ExternalAuditor] crear() error", {
        url,
        statusCode,
        errorMessage,
        fullError: error,
      });

      throw error;
    }
  }

  /**
   * Obtener designación de auditor externo
   */
  async obtener(societyId: number, flowId: number): Promise<ExternalAuditorDTO | null> {
    const url = this.getUrl(societyId, flowId);
    const config = withAuthHeaders({
      method: "GET" as const,
    });

    console.debug("[Repository][ExternalAuditor] obtener() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data?: ExternalAuditorDTO;
        code: number;
      }>(url, config);

      console.debug("[Repository][ExternalAuditor] obtener() success", {
        hasData: !!response.data,
      });

      return response.data || null;
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;

      // Si es 404, no existe (es normal)
      if (statusCode === 404) {
        console.debug("[Repository][ExternalAuditor] obtener() - No existe (404)");
        return null;
      }

      const errorMessage =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";

      console.error("[Repository][ExternalAuditor] obtener() error", {
        url,
        statusCode,
        errorMessage,
        fullError: error,
      });

      throw error;
    }
  }

  /**
   * Actualizar designación de auditor externo
   */
  async actualizar(societyId: number, flowId: number, dto: ExternalAuditorDTO): Promise<void> {
    const url = this.getUrl(societyId, flowId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: dto,
    });

    console.debug("[Repository][ExternalAuditor] actualizar() request", {
      url,
      societyId,
      flowId,
      dto,
    });

    try {
      await $fetch(url, config);
      console.debug("[Repository][ExternalAuditor] actualizar() success");
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const errorMessage =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";

      console.error("[Repository][ExternalAuditor] actualizar() error", {
        url,
        statusCode,
        errorMessage,
        fullError: error,
      });

      throw error;
    }
  }
}
