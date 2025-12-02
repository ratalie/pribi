import type { MeetingDetailsRepository } from '../../domain/ports/meeting-details.repository';
import type { MeetingDetails } from '../../domain/entities/meeting-details.entity';
import type {
  // DetallesJuntaDto, // No usado actualmente
  GeneralMeetingConfigDto,
} from '../../application/dtos/meeting-details.dto';
import { MeetingDetailsMapper } from '../mappers/meeting-details.mapper';
import { withAuthHeaders } from '~/core/shared/http/with-auth-headers';
import type { BackendApiResponse } from '~/core/shared/http/api-response.types';

/**
 * Implementación HTTP del repositorio de detalles de junta
 */
export class MeetingDetailsHttpRepository implements MeetingDetailsRepository {
  private readonly basePath = "/api/v2/society-profile";

  private getUrl(societyId: number, flowId: number): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost:3000");
        const basePath = this.basePath.startsWith("/") ? this.basePath : `/${this.basePath}`;
        const fullPath = `${basePath}/${societyId}/register-assembly/${flowId}/meeting-details`;
        return new URL(fullPath, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    // Fallback: construir URL relativa
    return `${this.basePath}/${societyId}/register-assembly/${flowId}/meeting-details`;
  }

  async get(societyId: number, flowId: number): Promise<MeetingDetails | null> {
    const url = this.getUrl(societyId, flowId);
    const config = withAuthHeaders({ method: 'GET' as const });

    console.debug('[Repository][MeetingDetailsHttp] get() request', {
      url,
      societyId,
      flowId,
    });

    try {
      const response = await $fetch<BackendApiResponse<GeneralMeetingConfigDto>>(url, config);

      console.debug('[Repository][MeetingDetailsHttp] get() response', response);

      if (response?.data) {
        const entity = MeetingDetailsMapper.fromResponseDto(response.data);
        console.debug('[Repository][MeetingDetailsHttp] get() mapped', entity);
        return entity;
      }

      return null;
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      console.error('[Repository][MeetingDetailsHttp] get() error', {
        url,
        statusCode,
        error: error?.message,
      });

      // Si el backend devuelve 404, significa que no hay detalles guardados aún
      if (statusCode === 404) {
        console.debug('[Repository][MeetingDetailsHttp] No hay detalles guardados (404)');
        return null;
      }

      throw error;
    }
  }

  async update(
    societyId: number,
    flowId: number,
    details: MeetingDetails
  ): Promise<void> {
    const url = this.getUrl(societyId, flowId);
    const dto = MeetingDetailsMapper.toDto(details);
    
    // ⚠️ IMPORTANTE: Para JUNTA_UNIVERSAL, eliminar segundaConvocatoria del payload
    // incluso si está como undefined, para evitar que se envíe
    if (dto.tipoJunta === 'JUNTA_UNIVERSAL' && 'segundaConvocatoria' in dto) {
      delete (dto as any).segundaConvocatoria;
      console.log('🧹 [Repository][MeetingDetailsHttp] Eliminado segundaConvocatoria del payload para Universal');
    }
    
    const config = withAuthHeaders({
      method: 'PUT' as const,
      body: dto,
    });

    console.debug('[Repository][MeetingDetailsHttp] update() request', {
      url,
      societyId,
      flowId,
      dto: JSON.stringify(dto, null, 2),
    });

    try {
      const response = await $fetch<BackendApiResponse<void>>(url, config);

      console.debug('[Repository][MeetingDetailsHttp] update() response', response);

      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar los detalles de la junta');
      }
    } catch (error: any) {
      const statusCode = error?.statusCode ?? error?.response?.status ?? null;
      const message =
        error?.data?.message ??
        error?.response?._data?.message ??
        error?.message ??
        'Error desconocido';
      console.error('[Repository][MeetingDetailsHttp] update() error', {
        url,
        statusCode,
        message,
      });
      throw error;
    }
  }
}

