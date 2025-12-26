import type { BackendApiResponse } from "~/core/shared/http/api-response.types";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { ApoderadoDTO, ClaseApoderadoResponseDTO } from "../../application";
import type { ApoderadoResponseDTO } from "../../application/dtos/apoderado-response.dto";
import type {
  Apoderado,
  ApoderadosRepository,
  ClaseApoderado,
  ClaseApoderadoPayload,
} from "../../domain";
import { ApoderadosMapper } from "../mappers/apoderados.mapper";
import { ClasesApoderadosMapper } from "../mappers/clases-apoderados.mapper";

export class ApoderadosHttpRepository implements ApoderadosRepository {
  private readonly basePath = (() => {
    const config = useRuntimeConfig();
    const override = config.public?.societyProfileEndpoint as string | undefined;
    return override && override.length > 0 ? override : "/api/v2/society-profile";
  })();

  private resolveBase(path: string = ""): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
        return new URL(`${basePath}${path}`, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    return `${this.basePath}${path}`;
  }

  private getUrl(profileId: string, suffix?: string): string {
    const useSuffix = suffix ? `/${suffix}` : "";
    return this.resolveBase(`/${profileId}/attorney-register${useSuffix}`);
  }

  //clases de apoderado
  async listClases(profileId: string): Promise<ClaseApoderado[]> {
    const url = this.getUrl(profileId, "classes");
    const config = withAuthHeaders({ method: "GET" as const });

    const response = await $fetch<BackendApiResponse<ClaseApoderadoResponseDTO[]>>(
      url,
      config
    );

    if (!response.success || !response?.data) {
      throw new Error("No se encontraron clases de apoderado");
    }

    return ClasesApoderadosMapper.deListaRespuestaADominio(response.data);
  }

  async createClase(profileId: string, payload: ClaseApoderadoPayload): Promise<void> {
    const url = this.getUrl(profileId, "classes");
    const config = withAuthHeaders({
      method: "POST" as const,
      body: ClasesApoderadosMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al crear la clase de apoderado");
    }

    // ⚠️ El backend NO retorna la clase creada, solo confirma éxito
    // Para obtener el ID, debes hacer un GET después
  }

  async updateClase(profileId: string, payload: ClaseApoderadoPayload): Promise<void> {
    const url = this.getUrl(profileId, "classes");
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: ClasesApoderadosMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al actualizar la clase de apoderado");
    }
  }

  async deleteClase(profileId: string, claseId: string): Promise<void> {
    const url = this.getUrl(profileId, `classes/${claseId}`);
    const config = withAuthHeaders({ method: "DELETE" as const });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al eliminar la clase de apoderado");
    }
  }

  //apoderados
  async listApoderados(profileId: string): Promise<Apoderado[]> {
    const url = this.getUrl(profileId, "attorneys");
    const config = withAuthHeaders({ method: "GET" as const });

    const response = await $fetch<BackendApiResponse<ApoderadoResponseDTO[]>>(url, config);

    if (!response.success || !response?.data) {
      throw new Error("No se encontraron apoderados");
    }

    return ApoderadosMapper.deListaRespuestaADominio(response.data);
  }

  async createApoderado(profileId: string, payload: ApoderadoDTO): Promise<void> {
    const url = this.getUrl(profileId, "attorneys");
    const config = withAuthHeaders({
      method: "POST" as const,
      body: ApoderadosMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al crear el apoderado");
    }

    // ⚠️ El backend NO retorna el apoderado creado, solo confirma éxito
    // Para obtener el ID, debes hacer un GET después
  }

  async updateApoderado(profileId: string, payload: ApoderadoDTO): Promise<void> {
    const url = this.getUrl(profileId, "attorneys");
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: ApoderadosMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al actualizar el apoderado");
    }
  }

  async deleteApoderado(profileId: string, apoderadoId: string): Promise<void> {
    const url = this.getUrl(profileId, `attorneys/${apoderadoId}`);
    const config = withAuthHeaders({ method: "DELETE" as const });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al eliminar el apoderado");
    }
  }

  //gerente general
  async createGerenteGeneral(profileId: string, payload: ApoderadoDTO): Promise<void> {
    const url = this.getUrl(profileId, "Gerente");
    const config = withAuthHeaders({
      method: "POST" as const,
      body: ApoderadosMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al crear el gerente general");
    }
  }

  async updateGerenteGeneral(profileId: string, payload: ApoderadoDTO): Promise<void> {
    const url = this.getUrl(profileId, "Gerente");
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: ApoderadosMapper.dePayloadABackend(payload),
    });

    const response = await $fetch<BackendApiResponse>(url, config);

    if (!response.success) {
      throw new Error(response.message || "Error al actualizar el gerente general");
    }
  }
}
