import type { FetchOptions } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { AgendaItemsDTO } from "../../application/dtos/agenda-item.dto";
import type { AgendaItemsRepository } from "../../domain/ports/agenda-items.repository";
import { AgendaItemsMapper } from "../mappers/agenda-items.mapper";

/**
 * Repositorio HTTP para Agenda Items
 * 
 * Implementa AgendaItemsRepository usando llamadas HTTP al backend.
 * 
 * Endpoints:
 * - GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
 * - PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
 */
export class AgendaItemsHttpRepository implements AgendaItemsRepository {
  private readonly basePath = "/api/v2/society-profile";

  /**
   * Resuelve la URL para los endpoints de agenda-items
   * @param societyId ID de la sociedad
   * @param flowId ID del flujo de junta
   * @param path Ruta adicional (vacía por defecto)
   */
  private resolveUrl(societyId: number, flowId: number, path: string = ""): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
        // Construir la ruta completa: /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
        const fullPath = `${basePath}/${societyId}/assembly/${flowId}/agenda-items${path}`;
        return new URL(fullPath, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    // Fallback: construir URL relativa
    return `${this.basePath}/${societyId}/assembly/${flowId}/agenda-items${path}`;
  }

  async get(societyId: number, flowId: number): Promise<AgendaItemsDTO | null> {
    const url = this.resolveUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][AgendaItemsHttp] get() request", {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: AgendaItemsDTO;
      }>(url, requestConfig);

      console.debug("[Repository][AgendaItemsHttp] get() response", response);

      if (!response?.data) {
        return null;
      }

      // El backend devuelve la estructura correcta, solo la validamos
      return AgendaItemsMapper.backendResponseToDTO(response.data);
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";

      // Si es 404, significa que no hay datos guardados aún (es normal)
      if (statusCode === 404) {
        console.debug("[Repository][AgendaItemsHttp] get() - No hay datos guardados (404)");
        return null;
      }

      console.error("[Repository][AgendaItemsHttp] get() error", {
        url,
        societyId,
        flowId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async update(societyId: number, flowId: number, payload: AgendaItemsDTO): Promise<void> {
    const url = this.resolveUrl(societyId, flowId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body: payload, // El payload ya está en el formato que el backend espera
    };

    console.debug("[Repository][AgendaItemsHttp] update() request", {
      url,
      societyId,
      flowId,
      payload,
    });

    try {
      await $fetch<{
        success: boolean;
        message: string;
        code: number;
      }>(url, requestConfig);

      console.debug("[Repository][AgendaItemsHttp] update() success", { flowId });
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][AgendaItemsHttp] update() error", {
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

