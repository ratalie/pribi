import type { BackendApiResponse } from "~/core/shared/http/api-response.types";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { ApoderadoDTO } from "../../application";
import type { ClaseApoderadoResponseDTO } from "../../application/dtos/clase-apoderado-response.dto";
import type {
  Apoderado,
  ApoderadosRepository,
  ClaseApoderado,
  ClaseApoderadoPayload,
} from "../../domain";
import { ApoderadosMapper } from "../mappers/apoderados.mapper";
import { ClasesApoderadosMapper } from "../mappers/clases-apoderados.mapper";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

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

  private getRegisterPath(profileId: string, suffix: string = "") {
    const sanitizedId = String(profileId).replace(/^\//, "");
    const base = this.resolveBase(`/${sanitizedId}/attorney-register`);
    return suffix ? `${base}/${suffix.replace(/^\//, "")}` : base;
  }

  private getUrl(profileId: string, suffix?: string): string {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string | undefined;

    if (!apiBase) {
      console.error(
        "[AccionesHttpRepository] apiBase no está configurado en runtimeConfig.public.apiBase"
      );
      throw new Error("apiBase no está configurado");
    }

    const useSuffix = suffix ? `/${suffix}` : "";

    return `${apiBase}/society-profile/${profileId}/attorney-register${useSuffix}`;
  }

  async listClases(profileId: string): Promise<ClaseApoderado[]> {
    const url = this.getRegisterPath(profileId, "classes");
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

  async listApoderados(profileId: string): Promise<Apoderado[]> {
    const url = this.getRegisterPath(profileId, "attorneys");
    const response = await $fetch<ApiResponse<any[]>>(
      url,
      withAuthHeaders({ method: "GET" as const })
    );
    const data = Array.isArray(response.data) ? response.data : [];
    return ApoderadosMapper.toApoderadoList(data);
  }

  async createApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
    const url = this.getRegisterPath(profileId, "attorneys");
    await $fetch(
      url,
      withAuthHeaders({
        method: "POST" as const,
        body: ApoderadosMapper.toApoderadoPayload(payload),
      })
    );
    return ApoderadosMapper.toApoderado(payload);
  }

  async updateApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
    const url = this.getRegisterPath(profileId, "attorneys");
    const response = await $fetch<ApiResponse<any>>(
      url,
      withAuthHeaders({
        method: "PUT" as const,
        body: ApoderadosMapper.toApoderadoPayload(payload),
      })
    );
    return ApoderadosMapper.toApoderado(response.data ?? payload);
  }

  async deleteApoderado(
    profileId: string,
    claseId: string,
    apoderadoId: string
  ): Promise<void> {
    const url = this.getRegisterPath(profileId, `attorneys/${claseId}/${apoderadoId}`);
    await $fetch(url, withAuthHeaders({ method: "DELETE" as const }));
  }
}
