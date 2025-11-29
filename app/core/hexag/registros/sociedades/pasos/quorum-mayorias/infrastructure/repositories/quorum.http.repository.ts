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
    const response = await $fetch<{ data: any }>(
      url,
      withAuthHeaders({ method: "GET" as const })
    );
    return QuorumMapper.toDomain(response?.data, idToUse) ?? null;
  }

  async create(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    // El backend ya crea la estructura inicial en el POST root,
    // entonces usamos PUT para actualizar/crear los quórums
    const url = this.resolveQuorumPath(societyProfileId);
    await $fetch(
      url,
      withAuthHeaders({
        method: "PUT" as const,
        body: QuorumMapper.toPayload(payload),
      })
    );

    // Usar el societyProfileId como fallback si el backend no retorna id
    const fresh = await this.get(societyProfileId, societyProfileId);
    if (!fresh) {
      throw new Error("No pudimos obtener el quórum después de crearlo.");
    }
    return fresh;
  }

  async update(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    const url = this.resolveQuorumPath(societyProfileId);
    await $fetch(
      url,
      withAuthHeaders({
        method: "PUT" as const,
        body: QuorumMapper.toPayload(payload),
      })
    );

    // Siempre usar societyProfileId como id porque el backend no lo retorna
    const fresh = await this.get(societyProfileId, societyProfileId);
    if (!fresh) {
      throw new Error("No pudimos obtener el quórum después de actualizarlo.");
    }
    return fresh;
  }
}
