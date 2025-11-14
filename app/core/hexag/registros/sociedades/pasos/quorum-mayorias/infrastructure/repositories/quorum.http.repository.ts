import type { QuorumDTO } from "../../application";
import type { QuorumRepository, QuorumConfig } from "../../domain";
import { QuorumMapper } from "../mappers/quorum.mapper";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

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

  async get(societyProfileId: string): Promise<QuorumConfig | null> {
    const response = await $fetch<{ data: any }>(
      this.resolveQuorumPath(societyProfileId),
      withAuthHeaders({ method: "GET" as const })
    );
    return QuorumMapper.toDomain(response?.data) ?? null;
  }

  async create(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    await $fetch(
      this.resolveQuorumPath(societyProfileId),
      withAuthHeaders({
        method: "POST" as const,
        body: QuorumMapper.toPayload(payload),
      })
    );
    const fresh = await this.get(societyProfileId);
    if (!fresh) {
      throw new Error("No pudimos obtener el quórum después de crearlo.");
    }
    return fresh;
  }

  async update(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    await $fetch(
      this.resolveQuorumPath(societyProfileId),
      withAuthHeaders({
        method: "PUT" as const,
        body: QuorumMapper.toPayload(payload),
      })
    );
    const fresh = await this.get(societyProfileId);
    if (!fresh) {
      throw new Error("No pudimos obtener el quórum después de actualizarlo.");
    }
    return fresh;
  }
}

