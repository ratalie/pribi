import type { FetchOptions } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { DownloadDataRepository } from "../../domain/ports/download-data.repository";
import type { DownloadDataDTO } from "../../application/dtos/download-data.dto";

/**
 * Repositorio HTTP para Download Data
 * 
 * Implementa DownloadDataRepository usando llamadas HTTP al backend.
 * 
 * Endpoint:
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/download-data
 */
export class DownloadDataHttpRepository implements DownloadDataRepository {
  private readonly basePath = "/api/v2/society-profile";

  /**
   * Resuelve la URL para el endpoint download-data
   */
  private resolveUrl(societyId: number, flowId: number): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
        const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/download-data`;
        return new URL(fullPath, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    // Fallback: construir URL relativa
    return `${this.basePath}/${societyId}/register-assembly/${flowId}/download-data`;
  }

  async get(societyId: number, flowId: number): Promise<DownloadDataDTO> {
    const url = this.resolveUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][DownloadDataHttp] get() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: DownloadDataDTO;
      }>(url, requestConfig);

      console.debug("[Repository][DownloadDataHttp] get() response", {
        hasData: !!response?.data,
        hasAgendaItems: !!response?.data?.agendaItems,
        hasMeetingDetails: !!response?.data?.meetingDetails,
        attendanceCount: response?.data?.attendance?.length || 0,
        hasAporteDinerario: !!response?.data?.agendaItemsData?.aporteDinerario,
      });

      if (!response?.data) {
        throw new Error("La respuesta del backend no incluye los datos de descarga.");
      }

      return response.data;
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][DownloadDataHttp] get() error", {
        url,
        societyId,
        flowId,
        statusCode,
        message,
      });
      throw error;
    }
  }
}

