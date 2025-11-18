import type { QuorumDTO } from "../../application";
import type { QuorumRepository, QuorumConfig } from "../../domain";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
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

  private logRequest(action: string, url: string, config: Record<string, any>) {
    const headers = config.headers;
    let authHeader: string | undefined;
    if (headers instanceof Headers) {
      authHeader = headers.get("Authorization") ?? undefined;
    } else if (headers && typeof headers === "object") {
      authHeader = headers.Authorization ?? headers.authorization;
    }
    const tokenPreview =
      authHeader && authHeader.length > 12
        ? `${authHeader.replace(/^Bearer\s+/i, "").slice(0, 6)}…${authHeader.slice(-4)}`
        : authHeader?.replace(/^Bearer\s+/i, "") ?? null;

    console.debug(`[Repository][QuorumHttp] ${action}:request`, {
      url,
      hasAuthHeader: Boolean(authHeader),
      tokenPreview,
    });
  }

  private logError(action: string, url: string, error: any) {
    const statusCode = error?.statusCode ?? error?.response?.status ?? null;
    console.error(`[Repository][QuorumHttp] ${action}:error`, {
      url,
      statusCode,
      message: error?.data?.message ?? error?.message,
    });
  }

  async get(societyProfileId: string): Promise<QuorumConfig | null> {
    const url = this.resolveQuorumPath(societyProfileId);
    const config = withAuthHeaders({ method: "GET" as const });
    this.logRequest("get", url, config as Record<string, any>);
    try {
      const response = await $fetch<{ data: any }>(url, config);
      return QuorumMapper.toDomain(response?.data) ?? null;
    } catch (error) {
      this.logError("get", url, error);
      throw error;
    }
  }

  async create(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    const url = this.resolveQuorumPath(societyProfileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: QuorumMapper.toPayload(payload),
    });
    this.logRequest("create", url, config as Record<string, any>);
    try {
      await $fetch(url, config);
    } catch (error) {
      this.logError("create", url, error);
      throw error;
    }
    const fresh = await this.get(societyProfileId);
    if (!fresh) {
      throw new Error("No pudimos obtener el quórum después de crearlo.");
    }
    return fresh;
  }

  async update(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    const url = this.resolveQuorumPath(societyProfileId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: QuorumMapper.toPayload(payload),
    });
    this.logRequest("update", url, config as Record<string, any>);
    try {
      await $fetch(url, config);
    } catch (error) {
      this.logError("update", url, error);
      throw error;
    }
    const fresh = await this.get(societyProfileId);
    if (!fresh) {
      throw new Error("No pudimos obtener el quórum después de actualizarlo.");
    }
    return fresh;
  }
}

