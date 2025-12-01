import { ApoderadosMapper } from "../mappers/apoderados.mapper";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { ApoderadosRepository, Apoderado, ClaseApoderado } from "../../domain";
import type { ApoderadoDTO, ClaseApoderadoDTO } from "../../application";

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

  async listClases(profileId: string): Promise<ClaseApoderado[]> {
    const url = this.getRegisterPath(profileId, "classes");
    const response = await $fetch<ApiResponse<any[]>>(url, withAuthHeaders({ method: "GET" as const }));
    const data = Array.isArray(response.data) ? response.data : [];
    return ApoderadosMapper.toClaseList(data);
  }

  async createClase(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado> {
    const url = this.getRegisterPath(profileId, "classes");
    await $fetch(url, withAuthHeaders({ method: "POST" as const, body: ApoderadosMapper.toClasePayload(payload) }));
    return ApoderadosMapper.toClase(payload);
  }

  async updateClase(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado> {
    const url = this.getRegisterPath(profileId, "classes");
    const response = await $fetch<ApiResponse<any>>(
      url,
      withAuthHeaders({
        method: "PUT" as const,
        body: ApoderadosMapper.toClasePayload(payload),
      })
    );
    return ApoderadosMapper.toClase(response.data ?? payload);
  }

  async deleteClase(profileId: string, claseId: string): Promise<void> {
    const url = this.getRegisterPath(profileId, `classes/${claseId}`);
    await $fetch(url, withAuthHeaders({ method: "DELETE" as const }));
  }

  async listApoderados(profileId: string): Promise<Apoderado[]> {
    const url = this.getRegisterPath(profileId, "attorneys");
    const response = await $fetch<ApiResponse<any[]>>(url, withAuthHeaders({ method: "GET" as const }));
    const data = Array.isArray(response.data) ? response.data : [];
    return ApoderadosMapper.toApoderadoList(data);
  }

  async createApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
    const url = this.getRegisterPath(profileId, "attorneys");
    await $fetch(url, withAuthHeaders({ method: "POST" as const, body: ApoderadosMapper.toApoderadoPayload(payload) }));
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

  async deleteApoderado(profileId: string, claseId: string, apoderadoId: string): Promise<void> {
    // Según docs/API_DOCUMENTATION.md línea 966: DELETE /attorneys/:attorneyId (sin classId)
    const url = this.getRegisterPath(profileId, `attorneys/${apoderadoId}`);
    await $fetch(url, withAuthHeaders({ method: "DELETE" as const }));
  }
}


