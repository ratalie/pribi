import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { DirectorioDTO } from "../../application/dtos/directorio.dto";
import type { DirectorioConfig, DirectorioRepository } from "../../domain";
import { DirectorioMapper } from "../mappers/directorio.mapper";

export class DirectorioHttpRepository implements DirectorioRepository {
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

  private resolveDirectorioPath(societyProfileId: string): string {
    const sanitizedId = String(societyProfileId).replace(/^\//, "");
    return this.resolveBase(`/${sanitizedId}/directorio`);
  }

  private logRequest(action: string, url: string, details?: Record<string, unknown>) {
    console.debug(`[Repository][DirectorioHttp] ${action}:request`, {
      url,
      ...details,
    });
  }

  private logError(action: string, url: string, error: any) {
    const statusCode = error?.statusCode ?? error?.response?.status ?? null;
    console.error(`[Repository][DirectorioHttp] ${action}:error`, {
      url,
      statusCode,
      message: error?.data?.message ?? error?.message,
    });
  }

  async get(societyProfileId: string): Promise<DirectorioConfig | null> {
    const url = this.resolveDirectorioPath(societyProfileId);
    const config = withAuthHeaders({ method: "GET" as const });
    this.logRequest("get", url);

    try {
      const response = await $fetch<{ data: any }>(url, config);
      return DirectorioMapper.toDomain(response?.data) ?? null;
    } catch (error) {
      this.logError("get", url, error);
      throw error;
    }
  }

  async create(societyProfileId: string, payload: DirectorioDTO): Promise<DirectorioConfig> {
    const url = this.resolveDirectorioPath(societyProfileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: DirectorioMapper.toPayload(payload),
    });
    this.logRequest("create", url);

    try {
      await $fetch(url, config);
    } catch (error) {
      this.logError("create", url, error);
      throw error;
    }

    // Después de crear, obtener los datos frescos del backend
    const fresh = await this.get(societyProfileId);
    if (!fresh) {
      throw new Error(
        "No pudimos obtener la configuración del directorio después de crearla."
      );
    }
    return fresh;
  }

  async update(societyProfileId: string, payload: DirectorioDTO): Promise<DirectorioConfig> {
    const url = this.resolveDirectorioPath(societyProfileId);
    const transformedPayload = DirectorioMapper.toPayload(payload);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: transformedPayload,
    });
    this.logRequest("update", url, {
      directorioId: payload.id,
      originalPayload: payload,
      transformedPayload,
    });

    try {
      await $fetch(url, config);
    } catch (error) {
      this.logError("update", url, error);
      throw error;
    }

    // Después de actualizar, obtener los datos frescos del backend
    const fresh = await this.get(societyProfileId);
    if (!fresh) {
      throw new Error(
        "No pudimos obtener la configuración del directorio después de actualizarla."
      );
    }
    return fresh;
  }
}
