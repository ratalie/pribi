import type { BackendApiResponse } from "~/core/shared/http/api-response.types";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { TipoFacultadResponseDTO } from "../../application";
import type {
  RegimenFacultadesRepository,
  TipoFacultad,
  TipoFacultadPayload,
} from "../../domain";
import { TiposFacultadesMapper } from "../mappers/tipos-facultades.mapper";

export class RegimenFacultadesHttpRepository implements RegimenFacultadesRepository {
  private getUrl(profileId: string, suffix?: string): string {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string | undefined;

    if (!apiBase) {
      console.error(
        "[RegimenFacultadesHttpRepository] apiBase no está configurado en runtimeConfig.public.apiBase"
      );
      throw new Error("apiBase no está configurado");
    }

    const useSuffix = suffix ? `/${suffix}` : "";

    return `${apiBase}/society-profile/${profileId}/powers-regime${useSuffix}`;
  }

  async listTipoFacultades(profileId: string): Promise<TipoFacultad[]> {
    const url = this.getUrl(profileId, "powers");
    const config = withAuthHeaders({ method: "GET" as const });

    const response = await $fetch<BackendApiResponse<TipoFacultadResponseDTO[]>>(url, config);

    if (!response.success || !response?.data) {
      throw new Error("No se encontraron tipos de facultades");
    }

    return TiposFacultadesMapper.deListaRespuestaADominio(response.data);
  }

  async createTipoFacultad(profileId: string, payload: TipoFacultadPayload): Promise<void> {
    const url = this.getUrl(profileId, "powers");
    const config = withAuthHeaders({
      method: "POST" as const,
      body: TiposFacultadesMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al crear el tipo de facultad");
    }
  }

  async updateTipoFacultad(profileId: string, payload: TipoFacultadPayload): Promise<void> {
    const url = this.getUrl(profileId, "powers");
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: TiposFacultadesMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al actualizar el tipo de facultad");
    }
  }

  async deleteTipoFacultad(profileId: string, tipoFacultadId: string): Promise<void> {
    const url = this.getUrl(profileId, `powers/${tipoFacultadId}`);
    const config = withAuthHeaders({
      method: "DELETE" as const,
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al eliminar el tipo de facultad");
    }
  }
}
