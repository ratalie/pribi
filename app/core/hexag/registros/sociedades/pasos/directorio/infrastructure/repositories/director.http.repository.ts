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
    const mappedPayload = DirectorMapper.toPayload(payload);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: mappedPayload,
    });
    this.log("create:request", { 
      url, 
      societyProfileId, 
      rolDirector: payload.rolDirector,
      payload: JSON.stringify(payload, null, 2),
      mappedPayload: JSON.stringify(mappedPayload, null, 2)
    });

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
        
        // ✅ Buscar por documento y rol
        let fallback = list.find(
          (item) =>
            item.persona.numeroDocumento === payload.persona.numeroDocumento &&
            item.rolDirector === payload.rolDirector
        );
        
        // ✅ Si no encuentra por coincidencia exacta, usar el último de la lista
        // (asumiendo que es el recién creado)
        if (!fallback && list.length > 0) {
          fallback = list[list.length - 1];
          this.log("create:using-last-from-list", { directorId: fallback!.id });
        }

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
    // Validar que directorId no esté vacío
    if (!directorId || directorId.trim().length === 0) {
      throw new Error("El ID del director es requerido para actualizar");
    }

    // Asegurar que el ID del director esté en el payload (NO en la URL)
    const payloadWithId: DirectorDTO = {
      ...payload,
      id: directorId,
    };

    // Validar que el payload tenga los campos requeridos
    if (!payloadWithId.persona) {
      throw new Error("El objeto persona es requerido en el payload");
    }
    if (!payloadWithId.rolDirector) {
      throw new Error("El rolDirector es requerido en el payload");
    }

    const mappedPayload = DirectorMapper.toPayload(payloadWithId);

    // Construir la URL SIN el directorId (el ID va en el body, no en la ruta)
    const url = this.resolveDirectoresPath(societyProfileId);

    const config = withAuthHeaders({
      method: "PUT" as const,
      body: mappedPayload,
    });

    this.log("update:request", {
      url,
      directorId,
      societyProfileId,
      originalPayload: payload,
      payloadWithId,
      mappedPayload,
      directorIdInPayload: mappedPayload.id,
      personaInPayload: mappedPayload.persona,
      rolDirectorInPayload: mappedPayload.rolDirector,
    });

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

  async delete(societyProfileId: string, directorId: string): Promise<void> {
    // Validar que directorId no esté vacío
    if (!directorId || directorId.trim().length === 0) {
      throw new Error("El ID del director es requerido para eliminar");
    }

    // Construir la URL (misma ruta que update, sin directorId en el path)
    const url = this.resolveDirectoresPath(societyProfileId);

    // El backend espera un array con los IDs a eliminar
    const config = withAuthHeaders({
      method: "DELETE" as const,
      body: [directorId],
    });

    this.log("delete:request", {
      url,
      directorId,
      societyProfileId,
      body: [directorId],
    });

    try {
      await $fetch(url, config);
      this.log("delete:success", { directorId });
    } catch (error) {
      this.log("delete:error", { error, url, directorId });
      throw error;
    }
  }
}
