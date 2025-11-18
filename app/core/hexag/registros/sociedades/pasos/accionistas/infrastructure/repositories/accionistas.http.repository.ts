import { AccionistasMapper } from "../mappers/accionistas.mapper";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { AccionistasRepository, Accionista } from "../../domain";
import type { AccionistaDTO } from "../../application/dtos/accionista.dto";

interface ApiListResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  code?: number;
}

export class AccionistasHttpRepository implements AccionistasRepository {
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

  private getShareholderPath(profileId: string, suffix: string = "") {
    const sanitizedId = String(profileId).replace(/^\//, "");
    const base = this.resolveBase(`/${sanitizedId}/shareholder`);
    return suffix ? `${base}/${suffix.replace(/^\//, "")}` : base;
  }

  private log(action: string, details: Record<string, unknown>) {
    console.log(`[Repository][AccionistasHttp] ${action}`, details);
  }

  async list(profileId: string): Promise<Accionista[]> {
    const url = this.getShareholderPath(profileId);
    const config = withAuthHeaders({ method: "GET" as const });
    this.log("list:request", { url });
    const response = await $fetch<ApiListResponse<any[]>>(url, config);
    const data = Array.isArray(response?.data) ? response.data : [];
    const result = AccionistasMapper.toDomainList(data);
    this.log("list:success", { count: result.length });
    return result;
  }

  async create(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
    const url = this.getShareholderPath(profileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: AccionistasMapper.toPayload(payload),
    });
    this.log("create:request", { url, personaTipo: payload.persona?.tipo });
    const response = await $fetch<ApiListResponse<any>>(url, config);
    if (response?.data) {
      return AccionistasMapper.toDomain(response.data);
    }
    // Si el backend no devuelve data, refrescamos lista y devolvemos el último.
    const list = await this.list(profileId);
    const fallback = list.find((item) => item.persona.id === payload.persona.id);
    if (fallback) return fallback;
    throw new Error("El backend no devolvió el accionista creado.");
  }

  async update(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
    const url = this.getShareholderPath(profileId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: AccionistasMapper.toPayload(payload),
    });
    this.log("update:request", { url, accionistaId: payload.id });
    const response = await $fetch<ApiListResponse<any>>(url, config);
    if (response?.data) {
      return AccionistasMapper.toDomain(response.data);
    }
    // fallback: buscar en lista y devolver datos existentes
    const list = await this.list(profileId);
    const existing = list.find((item) => item.id === payload.id);
    if (existing) return existing;
    throw new Error("No pudimos obtener el accionista actualizado.");
  }

  async delete(profileId: string, accionistaId: string): Promise<void> {
    const url = this.getShareholderPath(profileId, accionistaId);
    const config = withAuthHeaders({ method: "DELETE" as const });
    this.log("delete:request", { url, accionistaId });
    await $fetch(url, config);
  }
}

