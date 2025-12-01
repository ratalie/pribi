import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { QuorumDTO } from "../../application";
import type { QuorumConfig, QuorumRepository } from "../../domain";
import { QuorumMapper } from "../mappers/quorum.mapper";

export class QuorumHttpRepository implements QuorumRepository {
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

  private resolveQuorumPath(societyProfileId: string): string {
    const sanitizedId = String(societyProfileId).replace(/^\//, "");
    return this.resolveBase(`/${sanitizedId}/quorum`);
  }

  async get(societyProfileId: string, fallbackId?: string): Promise<QuorumConfig | null> {
    const url = this.resolveQuorumPath(societyProfileId);
    // El id del quorum es el mismo que el societyProfileId (ej: /api/v2/society-profile/2/quorum => id = 2)
    // Siempre usar societyProfileId como id porque el backend no lo retorna
    const idToUse = fallbackId ?? societyProfileId;
    
    try {
      console.log("[Repository][QuorumHttp] get:request", { url, societyProfileId });
      const response = await $fetch<{ success?: boolean; data?: any; message?: string }>(
        url,
        withAuthHeaders({ method: "GET" as const })
      );
      console.log("[Repository][QuorumHttp] get:response", JSON.stringify(response, null, 2));
      
      if (response?.data) {
        return QuorumMapper.toDomain(response.data, idToUse) ?? null;
      }
      return null;
    } catch (error: any) {
      // Si el backend devuelve 404, significa que no hay quórums configurados
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      if (statusCode === 404) {
        console.log("[Repository][QuorumHttp] get:404 - No hay quórums configurados");
        return null;
      }
      console.error("[Repository][QuorumHttp] get:error", error);
      throw error;
    }
  }

  async create(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    // El backend ya crea la estructura inicial en el POST root,
    // entonces usamos PUT para actualizar/crear los quórums
    const url = this.resolveQuorumPath(societyProfileId);
    const mappedPayload = QuorumMapper.toPayload(payload);
    
    console.log("[Repository][QuorumHttp] create:request", { url, payload: JSON.stringify(mappedPayload, null, 2) });
    const response = await $fetch(
      url,
      withAuthHeaders({
        method: "PUT" as const,
        body: mappedPayload,
      })
    );
    console.log("[Repository][QuorumHttp] create:response", JSON.stringify(response, null, 2));

    // Usar el societyProfileId como fallback si el backend no retorna id
    // Esperar un poco antes de hacer GET para que el backend procese el PUT
    await new Promise(resolve => setTimeout(resolve, 100));
    const fresh = await this.get(societyProfileId, societyProfileId);
    if (!fresh) {
      throw new Error("No pudimos obtener el quórum después de crearlo.");
    }
    return fresh;
  }

  async update(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    const url = this.resolveQuorumPath(societyProfileId);
    const mappedPayload = QuorumMapper.toPayload(payload);
    
    console.log("[Repository][QuorumHttp] update:request", { url, payload: JSON.stringify(mappedPayload, null, 2) });
    const response = await $fetch(
      url,
      withAuthHeaders({
        method: "PUT" as const,
        body: mappedPayload,
      })
    );
    console.log("[Repository][QuorumHttp] update:response", JSON.stringify(response, null, 2));

    // Siempre usar societyProfileId como id porque el backend no lo retorna
    // Esperar un poco antes de hacer GET para que el backend procese el PUT
    await new Promise(resolve => setTimeout(resolve, 100));
    const fresh = await this.get(societyProfileId, societyProfileId);
    if (!fresh) {
      throw new Error("No pudimos obtener el quórum después de actualizarlo.");
    }
    return fresh;
  }
}
