import type { FetchOptions } from "ofetch";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type {
  UpdateVoteSessionRequestDTO,
  VoteSessionResponseDTO,
} from "../../application/dtos/vote.dto";
import type { VoteSession } from "../../domain/entities/vote-session.entity";
import type { VoteContext } from "../../domain/enums/vote-context.enum";
import type { VoteRepository } from "../../domain/ports/vote.repository.port";
import { VoteMapper } from "../mappers/vote.mapper";

/**
 * Implementación HTTP del repositorio de Votaciones
 */
export class VoteHttpRepository implements VoteRepository {
  private readonly basePath = "/api/v2/society-profile";

  /**
   * Resuelve la URL base
   */
  private resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        return new URL(base, origin || "http://localhost:3000").origin;
      } catch {
        continue;
      }
    }
    return "";
  }

  /**
   * GET - Obtener sesión de votación por contexto
   */
  async getVoteSession(
    societyId: number,
    flowId: number,
    contexto: VoteContext
  ): Promise<VoteSession | null> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}${this.basePath}/${societyId}/register-assembly/${flowId}/votes?contexto=${contexto}`;
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const requestConfig = {
      ...authConfig,
      method: "GET" as const,
    };

    console.debug("[Repository][VoteHttp] getVoteSession() request", {
      url,
      societyId,
      flowId,
      contexto,
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
        data: VoteSessionResponseDTO | null;
      }>(url, requestConfig);

      console.debug("[Repository][VoteHttp] getVoteSession() response", {
        success: response?.success,
        hasData: !!response?.data,
        itemsCount: response?.data?.items?.length || 0,
        items:
          response?.data?.items?.map((item: any) => ({
            id: item.id,
            label: item.label,
            orden: item.orden,
          })) || [],
      });

      if (!response?.success || !response?.data) {
        return null;
      }

      return VoteMapper.fromResponseDto(response.data, contexto);
    } catch (error: any) {
      // Si es 404, no existe la sesión (es normal)
      if (error.statusCode === 404 || error.status === 404) {
        console.debug("[Repository][VoteHttp] Sesión no encontrada (404), retornando null");
        return null;
      }

      console.error("[Repository][VoteHttp] getVoteSession() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
      });
      throw error;
    }
  }

  /**
   * POST - Crear nueva sesión de votación
   */
  async createVoteSession(
    societyId: number,
    flowId: number,
    session: VoteSession
  ): Promise<void> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}${this.basePath}/${societyId}/register-assembly/${flowId}/votes`;
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const body = VoteMapper.toCreateRequestDto(session);

    console.debug("[Repository][VoteHttp] createVoteSession() request", {
      url,
      societyId,
      flowId,
      sessionId: session.id,
      body: JSON.stringify(body, null, 2), // ✅ DEBUG: Ver qué se envía al backend
    });

    const requestConfig = {
      ...authConfig,
      method: "POST" as const,
      body,
    };

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
      }>(url, requestConfig);

      console.debug("[Repository][VoteHttp] createVoteSession() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Error al crear sesión de votación");
      }
    } catch (error: any) {
      console.error("[Repository][VoteHttp] createVoteSession() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
      });
      throw error;
    }
  }

  /**
   * PUT - Actualizar sesión de votación
   * ⚠️ IMPORTANTE: tipoAprobacion ahora está en cada item, no como parámetro separado
   */
  async updateVoteSession(
    societyId: number,
    flowId: number,
    contexto: VoteContext,
    items: any[]
    // ✅ tipoAprobacion ya no es parámetro separado, está en cada item
  ): Promise<void> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}${this.basePath}/${societyId}/register-assembly/${flowId}/votes`;
    const authConfig = withAuthHeaders() as FetchOptions & {
      headers?: Record<string, string>;
    };
    const body: UpdateVoteSessionRequestDTO = {
      contexto,
      items, // ✅ tipoAprobacion está dentro de cada item con accion: 'update'
    };

    // ✅ DEBUG: Ver qué se envía al backend
    console.log(
      "[Repository][VoteHttp] updateVoteSession() payload completo:",
      JSON.stringify(body, null, 2)
    );

    const requestConfig = {
      ...authConfig,
      method: "PUT" as const,
      body,
    };

    console.debug("[Repository][VoteHttp] updateVoteSession() request", {
      url,
      societyId,
      flowId,
      contexto,
      itemsCount: items.length,
      body: JSON.stringify(body, null, 2), // ✅ DEBUG: Ver payload completo
    });

    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        code: number;
      }>(url, requestConfig);

      console.debug("[Repository][VoteHttp] updateVoteSession() response", {
        success: response?.success,
        message: response?.message,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Error al actualizar sesión de votación");
      }
    } catch (error: any) {
      console.error("[Repository][VoteHttp] updateVoteSession() error", {
        url,
        error: error.message,
        statusCode: error.statusCode || error.status,
      });
      throw error;
    }
  }
}
