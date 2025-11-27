import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { DirectorDTO } from "../../application/dtos/director.dto";
import type { DirectorConfig } from "../../domain";
import type { DirectorRepository } from "../../domain/ports/director.repositorio";
import { DirectorMapper } from "../mappers/director.mapper";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  code?: number;
}

export class DirectorHttpRepository implements DirectorRepository {
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

  private resolveDirectoresPath(societyProfileId: string, directorId?: string): string {
    const sanitizedId = String(societyProfileId).replace(/^\//, "");
    const base = this.resolveBase(`/${sanitizedId}/directorio/directores`);
    return directorId ? `${base}/${directorId.replace(/^\//, "")}` : base;
  }

  private log(action: string, details: Record<string, unknown>) {
    console.debug(`[Repository][DirectorHttp] ${action}`, details);
  }

  async get(societyProfileId: string): Promise<DirectorConfig[]> {
    const url = this.resolveDirectoresPath(societyProfileId);
    const config = withAuthHeaders({ method: "GET" as const });
    this.log("get:request", { url, societyProfileId, config });

    try {
      // Intentar con diferentes formatos de respuesta
      const response = await $fetch<ApiResponse<any>>(url, {
        ...config,
        // Agregar manejo de errores más específico
        onResponseError({ response: errorResponse }) {
          console.error("[DirectorHttp] GET Error Response:", {
            status: errorResponse.status,
            statusText: errorResponse.statusText,
            body: errorResponse._data,
            headers: errorResponse.headers,
          });
        },
      });
      this.log("get:response", {
        response,
        hasData: !!response?.data,
        responseKeys: response ? Object.keys(response) : [],
        dataType: response?.data ? typeof response.data : "undefined",
        isArray: Array.isArray(response?.data),
        fullResponse: JSON.stringify(response, null, 2),
      });

      // El backend puede devolver data como array o como objeto con datos
      const data = response?.data?.datos ?? response?.data ?? [];
      const list = Array.isArray(data) ? data : [];

      this.log("get:processing", { listLength: list.length, firstItem: list[0] });

      const result = list
        .map((item: any) => {
          try {
            return DirectorMapper.toDomain(item);
          } catch (mapperError) {
            this.log("get:mapper-error", { item, error: mapperError });
            return null;
          }
        })
        .filter((item): item is DirectorConfig => item !== null);

      this.log("get:success", { count: result.length });
      return result;
    } catch (error: any) {
      // Log más detallado del error
      const errorDetails = {
        error,
        url,
        errorMessage: error instanceof Error ? error.message : String(error),
        statusCode: error?.statusCode ?? error?.status ?? error?.response?.status,
        statusText: error?.statusText ?? error?.response?.statusText,
        responseData: error?.data ?? error?.response?.data,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      };
      this.log("get:error", errorDetails);
      throw error;
    }
  }

  async create(societyProfileId: string, payload: DirectorDTO): Promise<DirectorConfig> {
    const url = this.resolveDirectoresPath(societyProfileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: DirectorMapper.toPayload(payload),
    });
    this.log("create:request", { url, societyProfileId, rolDirector: payload.rolDirector });

    try {
      const response = await $fetch<ApiResponse<any>>(url, config);
      this.log("create:response", { response, hasData: !!response?.data });

      // Intentar mapear la respuesta directa
      if (response?.data) {
        const director = DirectorMapper.toDomain(response.data);
        if (director) {
          this.log("create:success", { directorId: director.id });
          return director;
        }
      }

      // Si el backend no devuelve data, intentar fallback con GET
      // Pero si el GET falla, construir el director desde el payload
      try {
        const list = await this.get(societyProfileId);
        const fallback = list.find(
          (item) =>
            item.persona.numeroDocumento === payload.persona.numeroDocumento &&
            item.rolDirector === payload.rolDirector
        );

        if (fallback) {
          this.log("create:success-fallback", { directorId: fallback.id });
          return fallback;
        }
      } catch (getError) {
        this.log("create:fallback-get-failed", { error: getError });
        // Si el GET falla, construir el director desde el payload como último recurso
        const directorFromPayload = DirectorMapper.toDomain({
          id: payload.id,
          persona: payload.persona,
          rolDirector: payload.rolDirector,
          reemplazaId: payload.reemplazaId,
        });

        if (directorFromPayload) {
          this.log("create:success-from-payload", { directorId: directorFromPayload.id });
          return directorFromPayload;
        }
      }

      throw new Error(
        "El backend no devolvió el director creado y no pudimos construirlo desde el payload."
      );
    } catch (error) {
      this.log("create:error", { error, url });
      throw error;
    }
  }

  async update(
    societyProfileId: string,
    directorId: string,
    payload: DirectorDTO
  ): Promise<DirectorConfig> {
    const url = this.resolveDirectoresPath(societyProfileId, directorId);
    const config = withAuthHeaders({
      method: "PUT" as const,
      body: DirectorMapper.toPayload(payload),
    });
    this.log("update:request", { url, directorId, societyProfileId });

    try {
      const response = await $fetch<ApiResponse<any>>(url, config);

      if (response?.data) {
        const director = DirectorMapper.toDomain(response.data);
        if (director) {
          this.log("update:success", { directorId: director.id });
          return director;
        }
      }

      // Fallback: buscar en lista y devolver datos existentes
      const list = await this.get(societyProfileId);
      const existing = list.find((item) => item.id === directorId);

      if (existing) {
        this.log("update:success-fallback", { directorId: existing.id });
        return existing;
      }

      throw new Error("No pudimos obtener el director actualizado.");
    } catch (error) {
      this.log("update:error", { error, url });
      throw error;
    }
  }
}
