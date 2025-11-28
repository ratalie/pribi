import type { FetchOptions } from "ofetch";

import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { JuntaResumenDTO } from "../../application/dtos";
import type { JuntaRepository } from "../../domain/ports";
import { JuntaMapper } from "../mappers/junta.mapper";

export class JuntaHttpRepository implements JuntaRepository {
  private readonly basePath = "/api/v2/society-profile";

  private resolveUrl(societyId: number, path: string = ""): string {
    const config = useRuntimeConfig();
    const baseUrl = config.public?.apiBaseUrl as string | undefined;
    const basePath = baseUrl ? `${baseUrl}${this.basePath}` : this.basePath;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${basePath}/${societyId}/register-assembly${normalizedPath}`;
  }

  async create(societyId: number): Promise<string> {
    const url = this.resolveUrl(societyId);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
    };

    console.debug("[Repository][JuntaHttp] create() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: { flowStructureId: string | number };
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] create() response", response);

      const flowStructureId = response?.data?.flowStructureId;

      if (flowStructureId === undefined || flowStructureId === null) {
        throw new Error("La respuesta del backend no incluye el flowStructureId generado.");
      }

      // El backend devuelve un número, pero lo convertimos a string para consistencia
      return String(flowStructureId);
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] create() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async list(societyId: number): Promise<JuntaResumenDTO[]> {
    const url = this.resolveUrl(societyId, "/list");
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][JuntaHttp] list() request", {
      url,
      societyId,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: Array<{
          id: string | number;
          estado: string;
          actual: string;
        }>;
      }>(url, requestConfig);

      console.debug("[Repository][JuntaHttp] list() response", {
        count: response?.data?.length ?? 0,
      });

      const entries = Array.isArray(response?.data) ? response.data : [];
      return entries.map((item) =>
        JuntaMapper.toResumenDTO(item, societyId)
      );
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] list() error", {
        url,
        societyId,
        statusCode,
        message,
      });
      throw error;
    }
  }

  async delete(societyId: number, flowId: number): Promise<void> {
    const url = this.resolveUrl(societyId, `/${flowId}`);
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "DELETE" as const,
    };

    console.debug("[Repository][JuntaHttp] delete() request", {
      url,
      societyId,
      flowId,
    });

    try {
      await $fetch(url, requestConfig);
      console.debug("[Repository][JuntaHttp] delete() success", { flowId });
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][JuntaHttp] delete() error", {
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

