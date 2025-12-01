import type { BackendApiResponse } from "~/core/shared/http/api-response.types";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { AccionDataResponseDTO } from "../../application";
import type { Accion, AccionPayload, AccionesRepository } from "../../domain";
import { AccionesMapper } from "../mappers/acciones.mapper";

/**
 * Implementación HTTP del repositorio de acciones.
 */
export class AccionesHttpRepository implements AccionesRepository {
  private getUrl(profileId: string): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        return new URL(`/api/v2/society-profile/${profileId}/acction`, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    return `/api/v2/society-profile/${profileId}/acction`;
  }

  async list(profileId: string): Promise<Accion[]> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({ method: "GET" as const });

    try {
      console.log("[Repository][AccionesHttp] list:request", { url });
      const response = await $fetch<BackendApiResponse<AccionDataResponseDTO>>(url, config);
      console.log("[Repository][AccionesHttp] list:response", JSON.stringify(response, null, 2));

      if (response?.data) {
        const result = AccionesMapper.deListaRespuestaADominio(response.data.datos);
        console.log("[Repository][AccionesHttp] list:mapped", { count: result.length });
        return result;
      }
      return [];
    } catch (error: any) {
      // Si el backend devuelve 404, significa que no hay datos aún
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      if (statusCode === 404) {
        console.log("[Repository][AccionesHttp] list:404 - No hay acciones");
        return [];
      }
      console.error("[Repository][AccionesHttp] list:error", error);
      throw error;
    }
  }

  async create(profileId: string, payload: AccionPayload): Promise<void> {
    const url = this.getUrl(profileId);
    const mappedPayload = AccionesMapper.dePayloadABackend(payload);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: mappedPayload,
    });

    console.log("[Repository][AccionesHttp] create:request", { url, payload: JSON.stringify(mappedPayload, null, 2) });
    const response = await $fetch<BackendApiResponse>(url, config);
    console.log("[Repository][AccionesHttp] create:response", JSON.stringify(response, null, 2));

    if (!response.success) {
      throw new Error(response.message || "Error al crear la acción");
    }
  }

  async update(profileId: string, dto: AccionPayload): Promise<void> {
    const url = this.getUrl(profileId);
    const mappedPayload = AccionesMapper.dePayloadABackend(dto);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: mappedPayload,
    });

    console.log("[Repository][AccionesHttp] update:request", { url, payload: JSON.stringify(mappedPayload, null, 2) });
    const response = await $fetch<BackendApiResponse>(url, config);
    console.log("[Repository][AccionesHttp] update:response", JSON.stringify(response, null, 2));

    if (!response.success) {
      throw new Error(response.message || "Error al actualizar la acción");
    }
  }

  async delete(profileId: string, accionIds: string[]): Promise<void> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({
      method: "DELETE" as const,
      body: accionIds,
    });

    console.log("[Repository][AccionesHttp] delete:request", { url, accionIds });
    const response = await $fetch<BackendApiResponse>(url, config);
    console.log("[Repository][AccionesHttp] delete:response", JSON.stringify(response, null, 2));

    if (!response.success) {
      throw new Error(response.message || "Error al eliminar la acción");
    }
  }
}
