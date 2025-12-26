import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { AsignacionAccionesRepository, AsignacionAccionesDTO } from "../../domain/ports/asignacion-acciones.repository";

interface BackendApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: string;
}

/**
 * Repository HTTP para Asignación de Acciones
 * 
 * @backend-location Backend: /home/yull23/legal-factory/backend/src/modules/flows-v2/register-society-profile/4.share-assignment
 * @controller ShareAssignmentController en: presentation/controllers/share-assignment.controller.ts
 * @endpoint-base /api/v2/society-profile/{societyProfileId}/share-assignment
 * 
 * Endpoints disponibles:
 * - POST   /api/v2/society-profile/{id}/share-assignment - Crear asignación
 * - PUT    /api/v2/society-profile/{id}/share-assignment - Actualizar asignación
 * - GET    /api/v2/society-profile/{id}/share-assignment - Listar asignaciones
 * - DELETE /api/v2/society-profile/{id}/share-assignment/{assignmentId} - Eliminar asignación
 * 
 * @see docs/backend/04-asignacion-acciones.md para documentación completa
 */
export class AsignacionAccionesHttpRepository implements AsignacionAccionesRepository {
  private readonly basePath = (() => {
    const config = useRuntimeConfig();
    const override = config.public?.societyProfileEndpoint as string | undefined;
    // Backend: /api/v2/society-profile (mismo patrón que otros pasos del registro)
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

  private resolveAsignacionesPath(societyProfileId: string): string {
    const sanitizedId = String(societyProfileId).replace(/^\//, "");
    // Backend controller: @Controller('v2/society-profile/:id/share-assignment')
    // Endpoint: /api/v2/society-profile/{id}/share-assignment
    return this.resolveBase(`/${sanitizedId}/share-assignment`);
  }

  async create(societyProfileId: string, payload: AsignacionAccionesDTO): Promise<string> {
    const url = this.resolveAsignacionesPath(societyProfileId);
    const config = withAuthHeaders({
      method: "POST" as const,
      body: payload,
    });

    console.debug("[Repository][AsignacionAccionesHttp] create() request", {
      url,
      societyProfileId,
      payload,
    });

    try {
      const response = await $fetch<BackendApiResponse>(url, config);

      console.debug("[Repository][AsignacionAccionesHttp] create() response", response);

      // El backend puede devolver el ID en data o no devolverlo
      // Si no lo devuelve, usamos el ID del payload (que ya tiene UUID generado en el frontend)
      const assignmentId = response?.data || payload.id;

      if (!assignmentId) {
        throw new Error("La respuesta del backend no incluye el ID de la asignación generada.");
      }

      return assignmentId;
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        "Error desconocido";
      console.error("[Repository][AsignacionAccionesHttp] create() error", {
        url,
        societyProfileId,
        statusCode,
        message,
      });
      throw error;
    }
  }
}

