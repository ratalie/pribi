import type { BackendApiResponse } from "~/core/shared/http/api-response.types";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { AccionDataResponseDTO } from "../../application/dtos/accion-response.dto";
import type { AccionPayload } from "../../domain/entities/accion-payload.entity";
import type { Accion } from "../../domain/entities/accion.entity";
import type { AccionesRepository } from "../../domain/ports/acciones.repository";
import { AccionesMapper } from "../mappers/acciones.mapper";

/**
 * Implementación HTTP del repositorio de acciones.
 */
export class AccionesHttpRepository implements AccionesRepository {
  private getUrl(profileId: string, accionId?: string): string {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string | undefined;

    if (!apiBase) {
      console.error(
        "[AccionesHttpRepository] apiBase no está configurado en runtimeConfig.public.apiBase"
      );
      throw new Error("apiBase no está configurado");
    }

    const baseUrl = `${apiBase}/society-profile/${profileId}/acction`;
    return accionId ? `${baseUrl}/${accionId}` : baseUrl;
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

  async update(profileId: string, accionId: string, dto: AccionPayload): Promise<void> {
    const url = this.getUrl(profileId, accionId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: AccionesMapper.dePayloadABackend(dto),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Error al actualizar la acción");
    }
  }

  async delete(profileId: string, accionId: string): Promise<void> {
    const url = this.getUrl(profileId, accionId);
    const config = withAuthHeaders({ method: "DELETE" as const });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al eliminar la acción");
    }
  }
}
