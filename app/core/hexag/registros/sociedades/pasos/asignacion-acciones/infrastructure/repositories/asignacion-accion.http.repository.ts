import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { AsignacionAccionDTO } from "../../application/dtos/asignacion-accion.dto";
import type { AsignacionAccion } from "../../domain";
import type { AsignacionAccionRepository } from "../../domain/ports/asignacion-accion.repository";
import { AsignacionAccionMapper } from "../mappers/asignacion-accion.mapper";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  code?: number;
}

export class AsignacionAccionHttpRepository implements AsignacionAccionRepository {
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

  private resolveAsignacionAccionesPath(
    societyProfileId: string,
    asignacionAccionId?: string
  ): string {
    const sanitizedId = String(societyProfileId).replace(/^\//, "");
    const base = this.resolveBase(`/${sanitizedId}/asignacion-acciones`);
    return asignacionAccionId ? `${base}/${asignacionAccionId.replace(/^\//, "")}` : base;
  }

  private log(action: string, details: Record<string, unknown>) {
    console.debug(`[Repository][AsignacionAccionHttp] ${action}`, details);
  }

  async get(societyProfileId: string): Promise<AsignacionAccion[]> {
    const url = this.resolveAsignacionAccionesPath(societyProfileId);
    const config = withAuthHeaders({ method: "GET" as const });
    this.log("get:request", { url, societyProfileId, config });

    try {
      const response = await $fetch<ApiResponse<any>>(url, {
        ...config,
        onResponseError({ response: errorResponse }) {
          console.error("[AsignacionAccionHttp] GET Error Response:", {
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

      const result = AsignacionAccionMapper.toDomainList(list);

      this.log("get:success", { count: result.length });
      return result;
    } catch (error: any) {
      // Si el backend devuelve 404, significa que no hay datos aún
      const statusCode = error?.statusCode ?? error?.status ?? error?.response?.status;
      if (statusCode === 404) {
        this.log("get:not-found", { societyProfileId });
        return [];
      }

      // Log más detallado del error
      const errorDetails = {
        error,
        url,
        errorMessage: error instanceof Error ? error.message : String(error),
        statusCode,
        statusText: error?.statusText ?? error?.response?.statusText,
        responseData: error?.data ?? error?.response?.data,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      };
      this.log("get:error", errorDetails);
      throw error;
    }
  }

  async create(
    societyProfileId: string,
    payload: AsignacionAccionDTO
  ): Promise<AsignacionAccion> {
    const url = this.resolveAsignacionAccionesPath(societyProfileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: AsignacionAccionMapper.toPayload(payload),
    });
    this.log("create:request", {
      url,
      societyProfileId,
      accionId: payload.accionId,
      accionistaId: payload.accionistaId,
    });

    try {
      const response = await $fetch<ApiResponse<any>>(url, config);
      this.log("create:response", { response, hasData: !!response?.data });

      // Intentar mapear la respuesta directa
      if (response?.data) {
        const asignacionAccion = AsignacionAccionMapper.toDomain(response.data);
        if (asignacionAccion) {
          this.log("create:success", { asignacionAccionId: asignacionAccion.id });
          return asignacionAccion;
        }
      }

      // Si el backend no devuelve data, intentar fallback con GET
      try {
        const list = await this.get(societyProfileId);
        const fallback = list.find(
          (item) =>
            item.accionId === payload.accionId && item.accionistaId === payload.accionistaId
        );

        if (fallback) {
          this.log("create:success-fallback", { asignacionAccionId: fallback.id });
          return fallback;
        }
      } catch (getError) {
        this.log("create:fallback-get-failed", { error: getError });
        // Si el GET falla, construir la asignación desde el payload como último recurso
        const asignacionFromPayload = AsignacionAccionMapper.toDomain({
          id: payload.id || "",
          accionId: payload.accionId,
          accionistaId: payload.accionistaId,
          subscribedSharesQuantity: payload.cantidadSuscrita,
          pricePerShare: payload.precioPorAccion,
          percentagePaidPerShare: payload.porcentajePagadoPorAccion,
          unpaidDividendTotal: payload.totalDividendosPendientes,
          fullyPaid: payload.pagadoCompletamente,
        });

        if (asignacionFromPayload) {
          this.log("create:success-from-payload", {
            asignacionAccionId: asignacionFromPayload.id,
          });
          return asignacionFromPayload;
        }
      }

      throw new Error(
        "El backend no devolvió la asignación creada y no pudimos construirla desde el payload."
      );
    } catch (error) {
      this.log("create:error", { error, url });
      throw error;
    }
  }

  async update(
    societyProfileId: string,
    asignacionAccionId: string,
    payload: AsignacionAccionDTO
  ): Promise<AsignacionAccion> {
    // Validar que asignacionAccionId no esté vacío
    if (!asignacionAccionId || asignacionAccionId.trim().length === 0) {
      throw new Error("El ID de la asignación de acción es requerido para actualizar");
    }

    // Asegurar que el ID de la asignación esté en el payload (NO en la URL)
    const payloadWithId: AsignacionAccionDTO = {
      ...payload,
      id: asignacionAccionId,
    };

    // Validar que el payload tenga los campos requeridos
    if (!payloadWithId.accionId) {
      throw new Error("El accionId es requerido en el payload");
    }
    if (!payloadWithId.accionistaId) {
      throw new Error("El accionistaId es requerido en el payload");
    }

    const mappedPayload = AsignacionAccionMapper.toPayload(payloadWithId);

    // Construir la URL SIN el asignacionAccionId (el ID va en el body, no en la ruta)
    const url = this.resolveAsignacionAccionesPath(societyProfileId);

    const config = withAuthHeaders({
      method: "PUT" as const,
      body: mappedPayload,
    });

    this.log("update:request", {
      url,
      asignacionAccionId,
      societyProfileId,
      originalPayload: payload,
      payloadWithId,
      mappedPayload,
      asignacionAccionIdInPayload: mappedPayload.id,
      accionIdInPayload: mappedPayload.accionId,
      accionistaIdInPayload: mappedPayload.accionistaId,
    });

    try {
      const response = await $fetch<ApiResponse<any>>(url, config);

      if (response?.data) {
        const asignacionAccion = AsignacionAccionMapper.toDomain(response.data);
        if (asignacionAccion) {
          this.log("update:success", { asignacionAccionId: asignacionAccion.id });
          return asignacionAccion;
        }
      }

      // Fallback: buscar en lista y devolver datos existentes
      const list = await this.get(societyProfileId);
      const existing = list.find((item) => item.id === asignacionAccionId);

      if (existing) {
        this.log("update:success-fallback", { asignacionAccionId: existing.id });
        return existing;
      }

      throw new Error("No pudimos obtener la asignación de acción actualizada.");
    } catch (error) {
      this.log("update:error", { error, url });
      throw error;
    }
  }

  async delete(societyProfileId: string, asignacionAccionId: string): Promise<void> {
    // Validar que asignacionAccionId no esté vacío
    if (!asignacionAccionId || asignacionAccionId.trim().length === 0) {
      throw new Error("El ID de la asignación de acción es requerido para eliminar");
    }

    // Construir la URL (misma ruta que update, sin asignacionAccionId en el path)
    const url = this.resolveAsignacionAccionesPath(societyProfileId);

    // El backend espera un array con los IDs a eliminar
    const config = withAuthHeaders({
      method: "DELETE" as const,
      body: [asignacionAccionId],
    });

    this.log("delete:request", {
      url,
      asignacionAccionId,
      societyProfileId,
      body: [asignacionAccionId],
    });

    try {
      await $fetch(url, config);
      this.log("delete:success", { asignacionAccionId });
    } catch (error) {
      this.log("delete:error", { error, url, asignacionAccionId });
      throw error;
    }
  }
}
