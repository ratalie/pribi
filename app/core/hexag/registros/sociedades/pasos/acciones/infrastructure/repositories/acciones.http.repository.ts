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
    const apiBase = config.public?.apiBase as string | undefined;

    if (!apiBase) {
      console.error(
        "[AccionesHttpRepository] apiBase no está configurado en runtimeConfig.public.apiBase"
      );
      throw new Error("apiBase no está configurado");
    }

    return `${apiBase}/society-profile/${profileId}/acction`;
  }

  async list(profileId: string): Promise<Accion[]> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({ method: "GET" as const });

    try {
      const response = await $fetch<BackendApiResponse<AccionDataResponseDTO>>(url, config);

      if (response?.data) {
        const result = AccionesMapper.deListaRespuestaADominio(response.data.datos);
        return result;
      }
      return [];
    } catch (error: any) {
      // Si el backend devuelve 404, significa que no hay datos aún
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      if (statusCode === 404) {
        return [];
      }
      throw error;
    }
  }

  async create(profileId: string, payload: AccionPayload): Promise<void> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: AccionesMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al crear la acción");
    }
  }

  async update(profileId: string, dto: AccionPayload): Promise<void> {
    const url = this.getUrl(profileId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: AccionesMapper.dePayloadABackend(dto),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

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

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al eliminar la acción");
    }
  }
}
